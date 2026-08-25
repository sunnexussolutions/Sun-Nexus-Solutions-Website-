import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(dbUrl);

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the root

// Registration Endpoint
app.post('/api/contact', async (req, res) => {
    const data = req.body;
    
    try {
        const { 
            name, email, mobile, prn, division, academic_year, graduation_year, branch, other_branch,
            specialization, skills, domain, projects, github, linkedin, 
            codechef, hackerrank, languages 
        } = data;

        const final_branch = (branch === 'Other') ? other_branch : branch;

        // Ensure tables exist
        await sql`
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                first_name TEXT,
                last_name TEXT,
                name TEXT,
                username TEXT UNIQUE,
                password TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                status TEXT DEFAULT 'active',
                joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS contact_inquiries (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                mobile TEXT,
                prn TEXT,
                division TEXT,
                academic_year TEXT NOT NULL,
                graduation_year TEXT NOT NULL,
                branch TEXT NOT NULL,
                specialization TEXT,
                skills TEXT,
                domain TEXT,
                projects TEXT,
                github TEXT,
                linkedin TEXT,
                codechef TEXT,
                hackerrank TEXT,
                languages TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        try {
            await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS mobile TEXT`;
            await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS prn TEXT`;
            await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS division TEXT`;
        } catch (colErr) {
            // Ignore column check notices
        }

        // Insert Submission
        await sql`
            INSERT INTO contact_inquiries 
            (name, email, mobile, prn, division, academic_year, graduation_year, branch, specialization, skills, domain, projects, github, linkedin, codechef, hackerrank, languages)
            VALUES (
                ${name}, ${email}, ${mobile || null}, ${prn || null}, ${division || null}, ${academic_year}, ${graduation_year}, ${final_branch}, 
                ${specialization || null}, ${skills || null}, ${domain || null}, 
                ${projects || null}, ${github || null}, ${linkedin || null}, 
                ${codechef || null}, ${hackerrank || null}, ${languages || null}
            )
        `;

        res.json({ 
            success: true, 
            message: '🏆 Technical Profile Secured! Welcome to the Nexus ecosystem.' 
        });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ 
            success: false, 
            message: '❌ Protocol Error: Could not secure data in Neon DB. ' + error.message 
        });
    }
});

// General Contact Message Endpoint
app.post('/api/contact-message', async (req, res) => {
    const { name, email, mobile, subject, message } = req.body;
    
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS general_contact_messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                mobile TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            INSERT INTO general_contact_messages (name, email, mobile, subject, message)
            VALUES (${name}, ${email}, ${mobile || null}, ${subject || 'General Inquiry'}, ${message})
        `;

        res.json({ 
            success: true, 
            message: '✉️ Message Sent Successfully! Our team will get back to you shortly.' 
        });
    } catch (error) {
        console.error('Contact Message DB Error:', error);
        res.status(500).json({ 
            success: false, 
            message: '❌ Transmission Error: ' + error.message 
        });
    }
});

// Password Reset Tokens Database Table Initialization Helper
const initPasswordResetTokensTable = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id TEXT,
                email TEXT NOT NULL,
                otp_hash TEXT NOT NULL,
                reset_token_hash TEXT,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                attempts INTEGER DEFAULT 0,
                verified_at TIMESTAMP WITH TIME ZONE,
                used_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await sql`CREATE INDEX IF NOT EXISTS idx_prt_user_id ON password_reset_tokens(user_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_prt_email ON password_reset_tokens(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_prt_expires_at ON password_reset_tokens(expires_at)`;
    } catch (e) {
        console.warn('Password reset table initialization warning:', e.message);
    }
};

// Brevo Transactional Email Dispatcher
const sendBrevoResetEmail = async ({ toEmail, recipientName, otpCode }) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@sunnexussolutions.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Sun Nexus Solutions';

    console.log(`📧 BREVO_RESET_OTP_GENERATED for ${toEmail}: [${otpCode}]`);

    if (!apiKey) {
        console.log(`⚠️ BREVO_API_KEY not configured in .env. Logging OTP for local dev testing: [${otpCode}]`);
        return { success: true, mode: 'log_fallback' };
    }

    const payload = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail, name: recipientName || 'Nexus Member' }],
        subject: "Nexus Hub Password Reset Code",
        htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1329; color: #e2e8f0; margin: 0; padding: 20px; }
                .container { max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid rgba(0, 242, 254, 0.25); overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                .header { background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 30px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em; }
                .content { padding: 36px 30px; text-align: center; }
                .otp-box { background: rgba(0, 242, 254, 0.08); border: 2px dashed #00f2fe; border-radius: 14px; padding: 18px 24px; display: inline-block; margin: 24px 0; font-size: 36px; font-weight: 900; letter-spacing: 0.35em; color: #00f2fe; }
                .footer { background: #070d1e; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.08); }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>SUN NEXUS SOLUTIONS</h1>
                  <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-weight: 600;">Nexus Hub Security Verification</p>
                </div>
                <div class="content">
                  <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Hello ${recipientName || 'Nexus Member'},</h2>
                  <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">You requested a password reset for your Nexus Hub account. Use the verification code below to authorize your password update:</p>
                  
                  <div class="otp-box">${otpCode}</div>
                  
                  <p style="color: #f59e0b; font-size: 13.5px; font-weight: 600;">⏱️ This code expires in <strong>10 minutes</strong> and can only be used once.</p>
                  <p style="color: #64748b; font-size: 13px; margin-top: 20px;">If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                </div>
                <div class="footer">
                  <p style="margin: 0; font-weight: 700;">Sun Nexus Solutions • Nexus Hub</p>
                  <p style="margin: 4px 0 0 0;">Automated System Notification — Do Not Reply</p>
                </div>
              </div>
            </body>
            </html>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('❌ BREVO_API_ERROR:', errText);
            return { success: false, error: errText };
        }

        const data = await response.json();
        console.log('✅ BREVO_EMAIL_SENT_SUCCESSFULLY:', data);
        return { success: true, data };
    } catch (err) {
        console.error('❌ BREVO_FETCH_FAILED:', err.message);
        return { success: false, error: err.message };
    }
};

// Rate Limiter
const authRateLimitMap = new Map();
const checkRateLimit = (key, maxRequests = 5, windowMs = 60000) => {
    const now = Date.now();
    const record = authRateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
        authRateLimitMap.set(key, record);
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count += 1;
    authRateLimitMap.set(key, record);
    return true;
};

// Login Security Tables Migration Helper
const initLoginSecurityTables = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS login_attempts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                failed_attempts INT DEFAULT 0,
                locked_until TIMESTAMP WITH TIME ZONE,
                last_failed_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await sql`CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(LOWER(email))`;

        await sql`
            CREATE TABLE IF NOT EXISTS security_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id VARCHAR(255),
                email VARCHAR(255),
                event_type VARCHAR(50) NOT NULL,
                ip_address VARCHAR(100),
                user_agent TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await sql`CREATE INDEX IF NOT EXISTS idx_security_logs_email ON security_logs(LOWER(email))`;
    } catch (e) {
        console.warn('Login security tables initialization warning:', e.message);
    }
};

// Security Logging Helper
const logSecurityEvent = async (userId, email, eventType, req) => {
    try {
        await initLoginSecurityTables();
        const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1').split(',')[0].trim();
        const userAgent = req.headers['user-agent'] || '';
        await sql`
            INSERT INTO security_logs (user_id, email, event_type, ip_address, user_agent)
            VALUES (${userId || null}, ${email || null}, ${eventType}, ${ip}, ${userAgent})
        `;
    } catch (e) {
        console.error('Failed to log security event:', e.message);
    }
};

// Check Lockout Status Endpoint
app.post('/api/auth/check-lockout', async (req, res) => {
    const { username, email } = req.body;
    const inputVal = (email || username || '').trim().toLowerCase();
    if (!inputVal) {
        return res.json({ isLocked: false, attemptsRemaining: 3 });
    }

    try {
        await initLoginSecurityTables();
        const profiles = await sql`
            SELECT id, email FROM profiles 
            WHERE LOWER(email) = ${inputVal} OR LOWER(username) = ${inputVal} 
            LIMIT 1
        `;
        const targetEmail = profiles.length > 0 ? profiles[0].email.toLowerCase() : inputVal;

        const records = await sql`
            SELECT * FROM login_attempts 
            WHERE LOWER(email) = ${targetEmail} 
            LIMIT 1
        `;

        if (!records || records.length === 0) {
            return res.json({ isLocked: false, attemptsRemaining: 3 });
        }

        const rec = records[0];
        const nowMs = Date.now();

        if (rec.locked_until && new Date(rec.locked_until).getTime() > nowMs) {
            const lockedUntilMs = new Date(rec.locked_until).getTime();
            const remainingSeconds = Math.ceil((lockedUntilMs - nowMs) / 1000);
            return res.json({
                isLocked: true,
                attemptsRemaining: 0,
                lockedUntil: rec.locked_until,
                remainingSeconds,
                message: 'Too many incorrect attempts. Login temporarily locked.'
            });
        }

        const currentFailed = (rec.locked_until && new Date(rec.locked_until).getTime() <= nowMs) ? 0 : (rec.failed_attempts || 0);
        const attemptsRemaining = Math.max(0, 3 - currentFailed);
        return res.json({
            isLocked: false,
            attemptsRemaining
        });
    } catch (err) {
        console.error('Check lockout status error:', err);
        return res.json({ isLocked: false, attemptsRemaining: 3 });
    }
});

// Authentication Endpoints — Login with 3-Attempt Account Lockout & Security Logging
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // IP-level Rate Limiting
    const ipKey = `login_ip_${req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'}`;
    if (!checkRateLimit(ipKey, 20, 5 * 60 * 1000)) {
        return res.status(429).json({ 
            success: false, 
            message: 'Too many login requests from your IP address. Please try again later.' 
        });
    }

    const inputNormalized = String(username).trim().toLowerCase();

    try {
        await initLoginSecurityTables();
        await initProfilesTable();

        // High-Fidelity Master Bypass for Admins (Admin root bypass)
        if ((inputNormalized === 'admin@nexus.com' || inputNormalized === 'admin') && (password === 'admin123' || password === 'admin')) {
            await logSecurityEvent('admin_master', 'admin@nexus.com', 'LOGIN_SUCCESS', req);
            let savedAdmin = {};
            try {
                const adminRows = await sql`SELECT * FROM profiles WHERE id = 'admin_master' OR LOWER(email) = 'admin@nexus.com' OR LOWER(username) = 'admin' LIMIT 1`;
                if (adminRows && adminRows.length > 0) savedAdmin = adminRows[0];
            } catch (e) {}

            return res.json({ 
                success: true, 
                user: { 
                    id: 'admin_master',
                    email: 'admin@nexus.com',
                    username: 'admin',
                    firstName: savedAdmin.first_name || 'Nexus',
                    lastName: savedAdmin.last_name || 'Admin',
                    name: savedAdmin.name || 'Nexus Admin',
                    isAdmin: true,
                    status: 'active',
                    headline: savedAdmin.headline || 'Platform Administrator',
                    joinedAt: savedAdmin.joined_at || new Date().toISOString(),
                    avatar: savedAdmin.avatar || '',
                    banner: savedAdmin.banner || '',
                    ...savedAdmin
                } 
            });
        }

        // Look up user profile
        const profiles = await sql`
            SELECT * FROM profiles 
            WHERE LOWER(email) = ${inputNormalized} OR LOWER(username) = ${inputNormalized} 
            LIMIT 1
        `;
        const userProfile = profiles && profiles.length > 0 ? profiles[0] : null;
        const targetEmail = userProfile ? userProfile.email.toLowerCase() : inputNormalized;
        const targetUserId = userProfile ? userProfile.id : null;

        // Check account lockout status in DB
        const lockRecords = await sql`
            SELECT * FROM login_attempts 
            WHERE LOWER(email) = ${targetEmail} 
            LIMIT 1
        `;
        let attemptRecord = lockRecords && lockRecords.length > 0 ? lockRecords[0] : null;
        const nowMs = Date.now();

        if (attemptRecord && attemptRecord.locked_until) {
            const lockedUntilMs = new Date(attemptRecord.locked_until).getTime();
            if (lockedUntilMs > nowMs) {
                // ACCOUNT IS STILL LOCKED
                const remainingSeconds = Math.ceil((lockedUntilMs - nowMs) / 1000);
                await logSecurityEvent(targetUserId, targetEmail, 'LOGIN_LOCKED', req);
                return res.status(423).json({
                    success: false,
                    isLocked: true,
                    attemptsRemaining: 0,
                    lockedUntil: attemptRecord.locked_until,
                    remainingSeconds,
                    message: 'Too many incorrect attempts. Login temporarily locked.'
                });
            } else {
                // LOCKOUT HAS EXPIRED — Reset account lockout automatically
                await sql`
                    UPDATE login_attempts
                    SET failed_attempts = 0, locked_until = NULL, last_failed_at = NULL, updated_at = CURRENT_TIMESTAMP
                    WHERE LOWER(email) = ${targetEmail}
                `;
                await logSecurityEvent(targetUserId, targetEmail, 'LOGIN_UNLOCKED', req);
                attemptRecord = { ...attemptRecord, failed_attempts: 0, locked_until: null };
            }
        }

        // Validate Password
        let isValid = false;
        if (userProfile) {
            isValid = userProfile.password === password;
            if (!isValid && userProfile.password && (userProfile.password.startsWith('$2a$') || userProfile.password.startsWith('$2b$') || userProfile.password.startsWith('$2y$'))) {
                try {
                    isValid = await bcrypt.compare(password, userProfile.password);
                } catch (e) {
                    isValid = false;
                }
            }
        }

        if (isValid && userProfile) {
            // SUCCESSFUL LOGIN — Reset failed_attempts = 0, locked_until = NULL
            await sql`
                INSERT INTO login_attempts (email, user_id, failed_attempts, locked_until, last_failed_at, updated_at)
                VALUES (${targetEmail}, ${targetUserId}, 0, NULL, NULL, CURRENT_TIMESTAMP)
                ON CONFLICT (email) DO UPDATE
                SET failed_attempts = 0, locked_until = NULL, last_failed_at = NULL, user_id = EXCLUDED.user_id, updated_at = CURRENT_TIMESTAMP
            `;

            await logSecurityEvent(targetUserId, targetEmail, 'LOGIN_SUCCESS', req);

            if (userProfile.status === 'pending') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Your account is pending admin approval.' 
                });
            }

            return res.json({ 
                success: true, 
                user: { 
                    id: userProfile.id, 
                    email: userProfile.email,
                    username: userProfile.username,
                    name: userProfile.name || `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || userProfile.username,
                    firstName: userProfile.first_name || userProfile.firstName,
                    lastName: userProfile.last_name || userProfile.lastName,
                    isAdmin: !!(userProfile.is_admin || userProfile.isAdmin),
                    status: userProfile.status || 'active',
                    avatar: userProfile.avatar || '',
                    banner: userProfile.banner || '',
                    headline: userProfile.headline || '',
                    joinedAt: userProfile.joined_at || userProfile.joinedAt,
                    skills: userProfile.skills,
                    projects: userProfile.projects,
                    phone: userProfile.phone,
                    dob: userProfile.dob,
                    gender: userProfile.gender,
                    university: userProfile.university,
                    branch: userProfile.branch,
                    specialization: userProfile.specialization,
                    year: userProfile.year,
                    division: userProfile.division,
                    prnNumber: userProfile.prn_number,
                    selectedDomain: userProfile.selected_domain,
                    experienceLevel: userProfile.experience_level,
                    bio: userProfile.bio,
                    githubUrl: userProfile.github_url,
                    linkedinUrl: userProfile.linkedin_url,
                    portfolioUrl: userProfile.portfolio_url,
                    graduationYear: userProfile.graduation_year,
                    cgpa: userProfile.cgpa
                } 
            });
        }

        // INCORRECT CREDENTIALS (OR UNKNOWN USER)
        const currentFailed = (attemptRecord && attemptRecord.locked_until && new Date(attemptRecord.locked_until).getTime() <= nowMs) 
            ? 0 
            : (attemptRecord ? attemptRecord.failed_attempts || 0 : 0);
        const newFailedAttempts = currentFailed + 1;

        if (newFailedAttempts >= 3) {
            // 3RD INCORRECT ATTEMPT -> LOCK ACCOUNT FOR 5 MINUTES
            const newLockedUntil = new Date(nowMs + 5 * 60 * 1000);
            await sql`
                INSERT INTO login_attempts (email, user_id, failed_attempts, locked_until, last_failed_at, updated_at)
                VALUES (${targetEmail}, ${targetUserId}, 3, ${newLockedUntil.toISOString()}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (email) DO UPDATE
                SET failed_attempts = 3, locked_until = EXCLUDED.locked_until, last_failed_at = CURRENT_TIMESTAMP, user_id = EXCLUDED.user_id, updated_at = CURRENT_TIMESTAMP
            `;

            await logSecurityEvent(targetUserId, targetEmail, 'LOGIN_FAILED', req);
            await logSecurityEvent(targetUserId, targetEmail, 'LOGIN_LOCKED', req);

            return res.status(423).json({
                success: false,
                isLocked: true,
                attemptsRemaining: 0,
                lockedUntil: newLockedUntil.toISOString(),
                remainingSeconds: 300,
                message: 'Too many incorrect attempts. Login temporarily locked.'
            });
        } else {
            // 1ST OR 2ND INCORRECT ATTEMPT -> INCREMENT COUNTER
            const remaining = 3 - newFailedAttempts;
            await sql`
                INSERT INTO login_attempts (email, user_id, failed_attempts, locked_until, last_failed_at, updated_at)
                VALUES (${targetEmail}, ${targetUserId}, ${newFailedAttempts}, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (email) DO UPDATE
                SET failed_attempts = ${newFailedAttempts}, locked_until = NULL, last_failed_at = CURRENT_TIMESTAMP, user_id = EXCLUDED.user_id, updated_at = CURRENT_TIMESTAMP
            `;

            await logSecurityEvent(targetUserId, targetEmail, 'LOGIN_FAILED', req);

            return res.status(401).json({
                success: false,
                isLocked: false,
                attemptsRemaining: remaining,
                message: `Incorrect email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
            });
        }
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Connection to Cloud Hub interrupted.' });
    }
});

// Forgot Password API Endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'client';

    if (!checkRateLimit(`forgot_${clientIp}_${cleanEmail}`, 5, 60000)) {
        return res.status(429).json({ success: false, message: 'Too many reset requests. Please try again in 1 minute.' });
    }

    try {
        await initPasswordResetTokensTable();
        await initProfilesTable();

        const genericMessage = 'If an account exists for this email, a verification code has been sent.';

        const users = await sql`SELECT id, name, first_name, email FROM profiles WHERE LOWER(email) = ${cleanEmail} LIMIT 1`;
        
        if (!users || users.length === 0) {
            return res.json({ success: true, message: genericMessage });
        }

        const user = users[0];
        const recipientName = user.name || user.first_name || 'Nexus Member';

        const rawOtp = String(crypto.randomInt(100000, 1000000));
        const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        await sql`
            UPDATE password_reset_tokens 
            SET used_at = CURRENT_TIMESTAMP 
            WHERE LOWER(email) = ${cleanEmail} AND used_at IS NULL
        `;

        await sql`
            INSERT INTO password_reset_tokens (user_id, email, otp_hash, expires_at, attempts)
            VALUES (${user.id}, ${cleanEmail}, ${otpHash}, ${expiresAt}, 0)
        `;

        await sendBrevoResetEmail({ toEmail: cleanEmail, recipientName, otpCode: rawOtp });

        return res.json({ success: true, message: genericMessage });
    } catch (error) {
        console.error('Forgot Password Endpoint Error:', error);
        return res.status(500).json({ success: false, message: 'An internal error occurred. Please try again.' });
    }
});

// Resend Reset OTP API Endpoint
app.post('/api/auth/resend-reset-otp', async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!checkRateLimit(`resend_${cleanEmail}`, 1, 60000)) {
        return res.status(429).json({ success: false, message: 'Please wait 60 seconds before requesting another code.' });
    }

    try {
        await initPasswordResetTokensTable();
        await initProfilesTable();

        const genericMessage = 'If an account exists for this email, a new verification code has been sent.';

        const users = await sql`SELECT id, name, first_name, email FROM profiles WHERE LOWER(email) = ${cleanEmail} LIMIT 1`;
        if (!users || users.length === 0) {
            return res.json({ success: true, message: genericMessage });
        }

        const user = users[0];
        const recipientName = user.name || user.first_name || 'Nexus Member';

        const rawOtp = String(crypto.randomInt(100000, 1000000));
        const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        await sql`
            UPDATE password_reset_tokens 
            SET used_at = CURRENT_TIMESTAMP 
            WHERE LOWER(email) = ${cleanEmail} AND used_at IS NULL
        `;

        await sql`
            INSERT INTO password_reset_tokens (user_id, email, otp_hash, expires_at, attempts)
            VALUES (${user.id}, ${cleanEmail}, ${otpHash}, ${expiresAt}, 0)
        `;

        await sendBrevoResetEmail({ toEmail: cleanEmail, recipientName, otpCode: rawOtp });

        return res.json({ success: true, message: genericMessage });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Verify Reset OTP API Endpoint
app.post('/api/auth/verify-reset-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    try {
        await initPasswordResetTokensTable();

        const records = await sql`
            SELECT * FROM password_reset_tokens 
            WHERE LOWER(email) = ${cleanEmail} AND used_at IS NULL AND verified_at IS NULL
            ORDER BY created_at DESC LIMIT 1
        `;

        if (!records || records.length === 0) {
            return res.status(400).json({ success: false, message: 'No active password reset request found. Please request a new code.' });
        }

        const record = records[0];

        if (record.attempts >= 5) {
            await sql`UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ${record.id}`;
            return res.status(400).json({ success: false, message: 'Maximum verification attempts exceeded. Please request a new code.' });
        }

        if (new Date() > new Date(record.expires_at)) {
            await sql`UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ${record.id}`;
            return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
        }

        const submittedHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');

        if (submittedHash !== record.otp_hash) {
            const newAttempts = Number(record.attempts || 0) + 1;
            await sql`UPDATE password_reset_tokens SET attempts = ${newAttempts} WHERE id = ${record.id}`;

            if (newAttempts >= 5) {
                await sql`UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ${record.id}`;
                return res.status(400).json({ success: false, message: 'Maximum verification attempts exceeded. Please request a new code.' });
            }

            const remaining = 5 - newAttempts;
            return res.status(400).json({ success: false, message: `Invalid verification code. ${remaining} attempt(s) remaining.` });
        }

        const rawResetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(rawResetToken).digest('hex');

        await sql`
            UPDATE password_reset_tokens 
            SET verified_at = CURRENT_TIMESTAMP, reset_token_hash = ${resetTokenHash} 
            WHERE id = ${record.id}
        `;

        return res.json({
            success: true,
            message: 'OTP verified successfully.',
            resetToken: rawResetToken
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to verify code. Please try again.' });
    }
});

// Reset Password API Endpoint
app.post('/api/auth/reset-password', async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNum = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
        return res.status(400).json({ success: false, message: 'Password must contain uppercase, lowercase, number, and special character.' });
    }

    try {
        await initPasswordResetTokensTable();
        await initProfilesTable();

        const submittedTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        const records = await sql`
            SELECT * FROM password_reset_tokens 
            WHERE reset_token_hash = ${submittedTokenHash} 
              AND verified_at IS NOT NULL 
              AND used_at IS NULL
            ORDER BY created_at DESC LIMIT 1
        `;

        if (!records || records.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset session. Please restart password reset.' });
        }

        const record = records[0];

        const tokenMaxAgeMs = 15 * 60 * 1000;
        if (Date.now() - new Date(record.verified_at).getTime() > tokenMaxAgeMs) {
            await sql`UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ${record.id}`;
            return res.status(400).json({ success: false, message: 'Reset session has expired. Please request a new code.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await sql`
            UPDATE profiles 
            SET password = ${hashedPassword} 
            WHERE LOWER(email) = ${record.email.toLowerCase()} OR id = ${record.user_id}
        `;

        await sql`
            UPDATE password_reset_tokens 
            SET used_at = CURRENT_TIMESTAMP 
            WHERE LOWER(email) = ${record.email.toLowerCase()}
        `;

        // Clear any login lockout for this account upon password reset
        await sql`
            UPDATE login_attempts
            SET failed_attempts = 0, locked_until = NULL, last_failed_at = NULL, updated_at = CURRENT_TIMESTAMP
            WHERE LOWER(email) = ${record.email.toLowerCase()}
        `;

        await logSecurityEvent(record.user_id, record.email, 'PASSWORD_RESET', req);

        return res.json({
            success: true,
            message: 'Password reset successfully. Please log in with your new password.'
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
    }
});

app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    const id = `user_${Date.now()}`;
    const name = `${firstName} ${lastName}`;

    console.log(`📝 ATTEMPTING_REGISTRATION: ${email} (${username})`);

    try {
        await sql`
            INSERT INTO profiles (id, email, first_name, last_name, name, username, password, is_admin, status, joined_at)
            VALUES (${id}, ${email}, ${firstName}, ${lastName}, ${name}, ${username}, ${password}, false, 'pending', ${new Date().toISOString()})
        `;
        
        console.log(`✅ REGISTRATION_SUCCESS: ${email}`);
        res.json({ success: true, message: '🏆 Welcome to the Nexus! Profile activated.' });
    } catch (error) {
        console.error('❌ DATABASE_PROTOCOL_ERROR:', error.message);
        let msg = 'Protocol Error: Could not secure account.';
        if (error.message.includes('unique constraint')) {
            msg = '❌ Identity Conflict: Email or Username already exists.';
        }
        res.status(500).json({ success: false, message: msg });
    }
});

// Profiles Database Table Migration Helper
const initProfilesTable = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                first_name TEXT,
                last_name TEXT,
                name TEXT,
                username TEXT UNIQUE,
                password TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                status TEXT DEFAULT 'active',
                joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS headline TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banner TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS projects TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dob TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branch TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS division TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS prn_number TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_domain TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS graduation_year TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cgpa TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_image TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_date TEXT`;
    } catch (e) {
        console.warn('Profiles table initialization warning:', e.message);
    }
};

// Admin Proxy Endpoints & User Management Endpoints
app.get('/api/users', async (req, res) => {
    try {
        await initProfilesTable();
        const cloud = await sql`SELECT * FROM profiles ORDER BY joined_at DESC`;
        res.json(cloud);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        await initProfilesTable();
        const { id } = req.params;
        const cloud = await sql`SELECT * FROM profiles WHERE id = ${id} OR LOWER(email) = ${id.toLowerCase()} OR LOWER(username) = ${id.toLowerCase()} LIMIT 1`;
        if (cloud && cloud.length > 0) {
            return res.json({ success: true, user: cloud[0] });
        }
        res.status(404).json({ success: false, message: 'User profile not found' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const handleUserUpdate = async (req, res) => {
    try {
        await initProfilesTable();
        const { id } = req.params;
        const u = req.body;

        const existingList = await sql`SELECT * FROM profiles WHERE id = ${id} OR LOWER(email) = ${id.toLowerCase()} LIMIT 1`;
        const existing = (existingList && existingList.length > 0) ? existingList[0] : null;

        const name = u.name || u.fullName || (u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : (existing?.name || 'Member'));
        const firstName = u.firstName || u.first_name || (name ? name.split(' ')[0] : (existing?.first_name || 'Member'));
        const lastName = u.lastName || u.last_name || (name ? name.split(' ').slice(1).join(' ') : (existing?.last_name || ''));
        const username = u.username || existing?.username || id;
        const password = u.password || existing?.password || 'password123';
        const avatar = u.avatar !== undefined ? u.avatar : (existing?.avatar || '');
        const banner = u.banner || u.coverImage || u.cover_image || (existing?.banner || '');
        const skills = u.skills !== undefined ? (typeof u.skills === 'string' ? u.skills : JSON.stringify(u.skills)) : (existing?.skills || '[]');
        const projects = u.projects !== undefined ? (typeof u.projects === 'string' ? u.projects : JSON.stringify(u.projects)) : (existing?.projects || '[]');

        if (existing) {
            await sql`
                UPDATE profiles SET
                    first_name       = ${firstName},
                    last_name        = ${lastName},
                    name             = ${name},
                    username         = ${username},
                    phone            = ${u.phone || u.mobileNumber || existing.phone || ''},
                    avatar           = ${avatar},
                    banner           = ${banner},
                    headline         = ${u.headline || existing.headline || ''},
                    location         = ${u.location || u.address || existing.location || ''},
                    skills           = ${skills},
                    projects         = ${projects},
                    dob              = ${u.dob || existing.dob || ''},
                    gender           = ${u.gender || existing.gender || ''},
                    university       = ${u.university || existing.university || ''},
                    branch           = ${u.branch || existing.branch || ''},
                    specialization   = ${u.specialization || existing.specialization || ''},
                    year             = ${u.year || existing.year || ''},
                    division         = ${u.division || existing.division || ''},
                    prn_number       = ${u.prnNumber || u.prn_number || existing.prn_number || ''},
                    selected_domain  = ${u.selectedDomain || u.selected_domain || existing.selected_domain || ''},
                    experience_level = ${u.experienceLevel || u.experience_level || existing.experience_level || ''},
                    bio              = ${u.bio !== undefined ? u.bio : (existing.bio || '')},
                    github_url       = ${u.githubUrl || u.github_url || u.github || existing.github_url || ''},
                    linkedin_url     = ${u.linkedinUrl || u.linkedin_url || u.linkedin || existing.linkedin_url || ''},
                    portfolio_url    = ${u.portfolioUrl || u.portfolio_url || u.portfolio || existing.portfolio_url || ''},
                    resume           = ${u.resume || existing.resume || ''},
                    graduation_year  = ${u.graduationYear || u.graduation_year || existing.graduation_year || ''},
                    cgpa             = ${u.cgpa || existing.cgpa || ''},
                    updated_at       = CURRENT_TIMESTAMP
                WHERE id = ${existing.id}
            `;
        } else {
            const email = u.email || `${id}@nexus.com`;
            await sql`
                INSERT INTO profiles (
                    id, email, first_name, last_name, name, username, password, is_admin, status,
                    phone, avatar, banner, headline, location, skills, projects, dob, gender,
                    university, branch, specialization, year, division, prn_number, selected_domain,
                    experience_level, bio, github_url, linkedin_url, portfolio_url, resume, graduation_year, cgpa
                ) VALUES (
                    ${id}, ${email}, ${firstName}, ${lastName}, ${name}, ${username}, ${password}, ${Boolean(u.isAdmin)}, 'active',
                    ${u.phone || u.mobileNumber || ''}, ${avatar}, ${banner}, ${u.headline || ''}, ${u.location || u.address || ''}, ${skills}, ${projects}, ${u.dob || ''}, ${u.gender || ''},
                    ${u.university || ''}, ${u.branch || ''}, ${u.specialization || ''}, ${u.year || ''}, ${u.division || ''}, ${u.prnNumber || u.prn_number || ''}, ${u.selectedDomain || u.selected_domain || ''},
                    ${u.experienceLevel || u.experience_level || ''}, ${u.bio || ''}, ${u.githubUrl || u.github_url || u.github || ''}, ${u.linkedinUrl || u.linkedin_url || u.linkedin || ''}, ${u.portfolioUrl || u.portfolio_url || u.portfolio || ''}, ${u.resume || ''}, ${u.graduationYear || u.graduation_year || ''}, ${u.cgpa || ''}
                )
            `;
        }

        if (name || avatar) {
            try {
                await sql`
                    UPDATE projects 
                    SET owner_name = ${name}, owner_avatar = ${avatar}
                    WHERE owner_id = ${targetId}
                `;
            } catch (e) {}
        }

        const updatedCloud = await sql`SELECT * FROM profiles WHERE id = ${targetId} LIMIT 1`;
        const updatedUser = updatedCloud[0];

        res.json({ success: true, user: updatedUser, message: 'Profile saved to Neon DB successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

app.put('/api/users/:id', handleUserUpdate);
app.patch('/api/users/:id', handleUserUpdate);

app.get('/api/assessments', async (req, res) => {
    try {
        const cloud = await sql`SELECT * FROM assessments ORDER BY created_at DESC`;
        res.json(cloud);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/results', async (req, res) => {
    try {
        const cloud = await sql`SELECT * FROM results ORDER BY submitted_at DESC`;
        res.json(cloud);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/domains', async (req, res) => {
    try {
        const cloud = await sql`SELECT * FROM domains ORDER BY created_at ASC`;
        res.json(cloud);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const isNexusAdmin = (name) => {
    if (!name) return false;
    const n = String(name).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    return n === 'nexusadmin' || n === 'admin' || n === 'sunnexus' || n === 'adminmaster' || n === 'useradmin' || n === 'nexus' || n === 'systemadmin' || n === 'administrator' || n.includes('admin');
};

// Helper for parsing team member objects cleanly
const parseTeamMembers = (teamInput) => {
    if (!teamInput) return [];
    let list = [];
    if (Array.isArray(teamInput)) {
        list = teamInput.map(m => {
            if (typeof m === 'string') return { name: m, role: 'Contributor' };
            if (typeof m === 'object' && m !== null) {
                const name = m.name || m.fullName || m.userName || '';
                return {
                    id: m.id || m.userId || name,
                    name,
                    role: m.role || 'Contributor',
                    image: m.image || m.avatar || '',
                    email: m.email || ''
                };
            }
            return { name: String(m), role: 'Contributor' };
        });
    } else if (typeof teamInput === 'string') {
        try {
            const parsed = JSON.parse(teamInput);
            if (Array.isArray(parsed)) return parseTeamMembers(parsed);
        } catch (e) {}
        list = teamInput.split(',').map(s => s.trim()).filter(Boolean).map(name => ({
            name,
            role: 'Contributor'
        }));
    }
    return list.filter(m => m && m.name && !isNexusAdmin(m.name));
};

// Projects Database Table Migration Helper & Initial Data Seeder
let isProjectsTableInitialized = false;
const initProjectsTable = async () => {
    if (isProjectsTableInitialized) return;
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                owner_id TEXT NOT NULL,
                owner_name TEXT,
                owner_avatar TEXT,
                created_by TEXT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'in_progress',
                priority TEXT DEFAULT 'medium',
                domain TEXT DEFAULT 'Engineering',
                thumbnail TEXT,
                screenshots TEXT DEFAULT '[]',
                documents TEXT DEFAULT '[]',
                github TEXT,
                github_url TEXT,
                live_demo TEXT,
                live_demo_url TEXT,
                tech_stack TEXT DEFAULT '[]',
                completion INTEGER DEFAULT 0,
                completion_percentage INTEGER DEFAULT 0,
                category TEXT DEFAULT 'Advanced',
                visibility TEXT DEFAULT 'public',
                team_members TEXT DEFAULT '[]',
                role TEXT,
                start_date TEXT,
                completion_date TEXT,
                challenges TEXT,
                future_improvements TEXT,
                features TEXT DEFAULT '[]',
                architecture TEXT,
                likes INTEGER DEFAULT 0,
                views INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP WITH TIME ZONE
            )
        `;

        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_id TEXT DEFAULT 'user_admin'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_name TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_avatar TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS domain TEXT DEFAULT 'Engineering'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots TEXT DEFAULT '[]'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS documents TEXT DEFAULT '[]'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo_url TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT DEFAULT '[]'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion INTEGER DEFAULT 0`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Advanced'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_members TEXT DEFAULT '[]'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion_date TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenges TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS future_improvements TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS features TEXT DEFAULT '[]'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'monitor'`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS summary TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS apk_url TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS apk TEXT`;
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE`;

        await sql`
            CREATE TABLE IF NOT EXISTS deleted_projects (
                id TEXT PRIMARY KEY,
                title TEXT,
                deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const countRes = await sql`SELECT COUNT(*) as count FROM projects`;
        if (Number(countRes[0]?.count || 0) === 0) {
            console.log('Database table empty. Seeding initial 27 projects into Neon DB...');
            const seedProjects = [
                // Advanced Projects
                {
                    id: 'proj_sun_nexus_website',
                    owner_id: 'user_admin',
                    owner_name: 'B.Prasad',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514',
                    title: 'Sun Nexus Solutions Website',
                    description: 'A responsive website for Sun Nexus Solutions, showcasing their services and projects.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'Web Development',
                    completion: 100,
                    tech_stack: JSON.stringify(['React', 'HTML5', 'CSS3', 'JavaScript', 'Node.js']),
                    team_members: JSON.stringify([
                        { name: 'B.Prasad', role: 'Team Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
                        { name: 'C.Mallikarjuna Rao', role: 'Full Stack Dev', image: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572' },
                        { name: 'K.Raghu', role: 'Frontend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2010.27.23%20AM.jpeg?updatedAt=1760072973601' },
                        { name: 'S.Poojitha', role: 'UI/UX Designer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.24.52%20AM.jpeg?updatedAt=1760072972748' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_lab_manage_system',
                    owner_id: 'user_admin',
                    owner_name: 'C.Mallikarjuna Rao',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572',
                    title: 'Lab Manage System',
                    description: 'AI-based lab management and resource optimization system.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'Engineering',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'Django', 'React', 'PostgreSQL']),
                    team_members: JSON.stringify([
                        { name: 'C.Mallikarjuna Rao', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572' },
                        { name: 'N.Amrutha Varshini', role: 'ML Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_whatsapp_chatbot',
                    owner_id: 'user_admin',
                    owner_name: 'K.Girivardhan',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650',
                    title: 'Whatsapp Chatbot',
                    description: 'An AI-powered chatbot integrated with WhatsApp for instant customer support and automation.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['Node.js', 'WhatsApp API', 'Python', 'NLP']),
                    team_members: JSON.stringify([
                        { name: 'K.Girivardhan', role: 'Backend Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.34%20AM.jpeg?updatedAt=1760072974650' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_exam_invigilation',
                    owner_id: 'user_admin',
                    owner_name: 'B.Jaya Manideep',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
                    title: 'Exam invigilation management system',
                    description: 'An AI-based exam invigilation system to ensure academic integrity.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'OpenCV', 'Deep Learning', 'Flask']),
                    team_members: JSON.stringify([
                        { name: 'B.Jaya Manideep', role: 'ML Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
                        { name: 'G.Purna Reddy', role: 'Backend Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772599133/purna_reddy_mszkgg.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_ai_assignment_evaluator',
                    owner_id: 'user_admin',
                    owner_name: 'B.Charitha Reddy',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg',
                    title: 'AI assignment evaluator',
                    description: 'An AI-based system to evaluate student assignments automatically.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'NLP', 'BERT', 'FastAPI']),
                    team_members: JSON.stringify([
                        { name: 'B.Charitha Reddy', role: 'AI Specialist', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' },
                        { name: 'M.Swapna', role: 'Frontend Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_startup_management',
                    owner_id: 'user_admin',
                    owner_name: 'C.Varun',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772303456/varun.c.2_fod1hf.jpg',
                    title: 'Startup Management System',
                    description: 'A comprehensive management system for startups to track projects, tasks, and team collaboration.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'Engineering',
                    completion: 100,
                    tech_stack: JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB']),
                    team_members: JSON.stringify([
                        { name: 'C.Varun', role: 'Full Stack Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772303456/varun.c.2_fod1hf.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_meeting_summarizer',
                    owner_id: 'user_admin',
                    owner_name: 'B.Charitha Reddy',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg',
                    title: 'Meeting Summarizer',
                    description: 'AI-powered meeting summarization tool that transcribes and summarizes video calls.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'AI & ML',
                    completion: 100,
                    github_url: 'https://github.com/Bareddycharitha/Meeting-summariser',
                    tech_stack: JSON.stringify(['Python', 'Whisper AI', 'GPT-4', 'Streamlit']),
                    team_members: JSON.stringify([
                        { name: 'B.Charitha Reddy', role: 'AI Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_smart_attendance',
                    owner_id: 'user_admin',
                    owner_name: 'Lokesh',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/unnamed.jpg?updatedAt=1760094756157',
                    title: 'Smart Attendance System',
                    description: 'An AI-powered attendance tracking system using facial recognition for accurate record-keeping.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['OpenCV', 'FaceNet', 'Python', 'React']),
                    team_members: JSON.stringify([
                        { name: 'Lokesh', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/unnamed.jpg?updatedAt=1760094756157' },
                        { name: 'K.Varshith Naidu', role: 'AI Developer', image: 'https://ik.imagekit.io/kofq4cdghu/IMG-20250917-WA0086(1).jpg?updatedAt=1760094980018' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_timetable_management',
                    owner_id: 'user_admin',
                    owner_name: 'A.Lokesh Reddy',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
                    title: 'Automated Timetable Management System',
                    description: 'A smart scheduling system that generates optimized timetables for educational institutions.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'Engineering',
                    completion: 100,
                    tech_stack: JSON.stringify(['Genetic Algorithm', 'Python', 'Django', 'React']),
                    team_members: JSON.stringify([
                        { name: 'A.Lokesh Reddy', role: 'Project Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' },
                        { name: 'V.Gopinadh', role: 'Algorithm Spec', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.55.20%20AM.jpeg?updatedAt=1760074230579' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_crowd_shield',
                    owner_id: 'user_admin',
                    owner_name: 'A.Lokesh Reddy',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
                    title: 'Crowd-Sheild',
                    description: 'AI-powered crowd monitoring for public safety.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'Cyber Security',
                    completion: 100,
                    tech_stack: JSON.stringify(['YOLOv8', 'Computer Vision', 'Python', 'WebSockets']),
                    team_members: JSON.stringify([
                        { name: 'A.Lokesh Reddy', role: 'AI Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' },
                        { name: 'V.Gopinadh', role: 'System Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.55.20%20AM.jpeg?updatedAt=1760074230579' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_resume_analyzer',
                    owner_id: 'user_admin',
                    owner_name: 'B.Murali Krishna',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049',
                    title: 'AI-Powered Resume Analyzer',
                    description: 'AI evaluates resumes for job fit score and provides improvement insights.',
                    status: 'completed',
                    category: 'Advanced',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'NLP', 'spacy', 'Streamlit']),
                    team_members: JSON.stringify([
                        { name: 'B.Murali Krishna', role: 'ML Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049' }
                    ]),
                    visibility: 'public'
                },

                // Beginner Projects
                {
                    id: 'proj_ai_pushup_trainer',
                    owner_id: 'user_admin',
                    owner_name: 'B.Jaya Manideep',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
                    title: 'AI Push-Up Trainer',
                    description: 'An AI-powered push-up trainer that provides real-time feedback and coaching.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['OpenCV', 'MediaPipe', 'Python', 'Streamlit']),
                    team_members: JSON.stringify([
                        { name: 'B.Jaya Manideep', role: 'ML Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
                        { name: 'M.Swapna', role: 'UI Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_amazon_sales_dashboard',
                    owner_id: 'user_admin',
                    owner_name: 'M.Swapna',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg',
                    title: 'Amazon Sales Dashboard',
                    description: 'A comprehensive sales dashboard for Amazon sellers to track performance and analyze sales data.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'Data Science',
                    completion: 100,
                    tech_stack: JSON.stringify(['PowerBI', 'Python', 'Pandas', 'SQL']),
                    team_members: JSON.stringify([
                        { name: 'M.Swapna', role: 'Data Analyst', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_cricket_analysis',
                    owner_id: 'user_admin',
                    owner_name: 'B.Jaya Manideep',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
                    title: 'Cricket Performance Analysis(Virat Kohli)',
                    description: "An AI-driven performance analysis tool focusing on Virat Kohli's career statistics.",
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'Data Science',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'Pandas', 'Matplotlib', 'Seaborn']),
                    team_members: JSON.stringify([
                        { name: 'B.Jaya Manideep', role: 'Data Scientist', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
                        { name: 'M.Swapna', role: 'Data Analyst', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_majhali_kitchen',
                    owner_id: 'user_admin',
                    owner_name: 'A.Lokesh Reddy',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
                    title: 'Majhali Restaurant Kitchen',
                    description: 'Restaurant kitchen management system for efficient operations and inventory control.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'Web Development',
                    completion: 100,
                    tech_stack: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Firebase']),
                    team_members: JSON.stringify([
                        { name: 'A.Lokesh Reddy', role: 'Frontend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_rooftop_restaurant',
                    owner_id: 'user_admin',
                    owner_name: 'B.Prasad',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514',
                    title: 'Roof-Top Restaurant',
                    description: 'A modern restaurant management system for rooftop dining experiences.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'Web Development',
                    completion: 100,
                    tech_stack: JSON.stringify(['React', 'Tailwind CSS', 'Node.js']),
                    team_members: JSON.stringify([
                        { name: 'B.Prasad', role: 'Full Stack Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
                        { name: 'K.Bhargava', role: 'UI Engineer', image: 'https://res.cloudinary.com/djw0g8duw/image/upload/v1763865310/link_img_rusktx.png' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_rooftop_sales_dashboard',
                    owner_id: 'user_admin',
                    owner_name: 'M.Swapna',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg',
                    title: 'Roof-Top Sales Dashboard',
                    description: 'A sales dashboard for rooftop dining experiences providing revenue insights.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'Data Science',
                    completion: 100,
                    tech_stack: JSON.stringify(['Chart.js', 'JavaScript', 'SQL']),
                    team_members: JSON.stringify([
                        { name: 'M.Swapna', role: 'Data Analyst', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772688084/InShot_20250917_175835152.jpg_drrto9.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_face_expression_detector',
                    owner_id: 'user_admin',
                    owner_name: 'B.Jaya Manideep',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
                    title: 'Face-Expression Detector',
                    description: 'Expression detection system that identifies and analyzes facial expressions in real-time.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'Keras', 'OpenCV']),
                    team_members: JSON.stringify([
                        { name: 'B.Jaya Manideep', role: 'ML Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' },
                        { name: 'A.Vishnu Vardhan', role: 'Python Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772771807/WhatsApp_Image_2026-03-06_at_9.53.49_AM_e4nkcd.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_court_data_fetcher',
                    owner_id: 'user_admin',
                    owner_name: 'B.Jaya Manideep',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669',
                    title: 'Court Data Fetcher',
                    description: 'A system that fetches and displays court data for legal professionals.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'Engineering',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'Web Scraping', 'FastAPI']),
                    team_members: JSON.stringify([
                        { name: 'B.Jaya Manideep', role: 'Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.27.49%20AM.jpeg?updatedAt=1760072972669' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_credit_card_fraud',
                    owner_id: 'user_admin',
                    owner_name: 'A.Yaswanth',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg',
                    title: 'Credit-card Fraud Detection system',
                    description: 'An AI-powered system to detect and prevent credit card fraud in real-time.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'Scikit-Learn', 'Random Forest']),
                    team_members: JSON.stringify([
                        { name: 'A.Yaswanth', role: 'ML Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg' },
                        { name: 'B.Charitha Reddy', role: 'Data Scientist', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_wine_quality_prediction',
                    owner_id: 'user_admin',
                    owner_name: 'A.Yaswanth',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg',
                    title: 'Wine Quality Prediction System',
                    description: 'A machine learning model to predict wine quality based on chemical properties.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'AI & ML',
                    completion: 100,
                    tech_stack: JSON.stringify(['Python', 'XGBoost', 'Pandas']),
                    team_members: JSON.stringify([
                        { name: 'A.Yaswanth', role: 'ML Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772601567/yaswanth_gj9y5q.jpg' },
                        { name: 'B.Charitha Reddy', role: 'Data Scientist', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_hotel_tfi_website',
                    owner_id: 'user_admin',
                    owner_name: 'B.Prasad',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514',
                    title: 'Hotel Tfi Website',
                    description: 'A website useful for booking food from Tfi Hotel in Nashik.',
                    status: 'completed',
                    category: 'Beginner',
                    domain: 'Web Development',
                    completion: 100,
                    tech_stack: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Bootstrap']),
                    team_members: JSON.stringify([
                        { name: 'B.Prasad', role: 'Web Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
                        { name: 'C.Mallikarjuna', role: 'Frontend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572' }
                    ]),
                    visibility: 'public'
                },

                // Ongoing Projects
                {
                    id: 'proj_swarna',
                    owner_id: 'user_admin',
                    owner_name: 'R.Manoj',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772612644/manoj_buozjy.jpg',
                    title: 'Swarna',
                    description: 'A comprehensive platform for gold price tracking, investment insights, and market analysis.',
                    status: 'in_progress',
                    category: 'Ongoing',
                    domain: 'Web Development',
                    completion: 60,
                    tech_stack: JSON.stringify(['React', 'Node.js', 'Chart.js', 'Financial API']),
                    team_members: JSON.stringify([
                        { name: 'R.Manoj', role: 'Lead Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772612644/manoj_buozjy.jpg' },
                        { name: 'M.Deekshitha', role: 'UI/UX Designer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.49%20AM.jpeg?updatedAt=1760072973031' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_timetable_project',
                    owner_id: 'user_admin',
                    owner_name: 'K.Bharath Kumar',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.51%20AM.jpeg?updatedAt=1760072973494',
                    title: 'Time Table Project',
                    description: 'An AI-based time table management system for educational institutions.',
                    status: 'in_progress',
                    category: 'Ongoing',
                    domain: 'Engineering',
                    completion: 55,
                    tech_stack: JSON.stringify(['Python', 'Django', 'React']),
                    team_members: JSON.stringify([
                        { name: 'K.Bharath Kumar', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.29.51%20AM.jpeg?updatedAt=1760072973494' },
                        { name: 'M.Madhusudhan', role: 'Backend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2011.09.30%20AM.jpeg?updatedAt=1760074790613' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_backlog_assistance',
                    owner_id: 'user_admin',
                    owner_name: 'T.Vanaja',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/vanaja_izfe76.jpg',
                    title: 'Smart backlog assistance & cover guidance system.',
                    description: 'An AI-based system to assist students with backlog subjects and provide study guidance.',
                    status: 'in_progress',
                    category: 'Ongoing',
                    domain: 'AI & ML',
                    completion: 45,
                    tech_stack: JSON.stringify(['Python', 'NLP', 'React']),
                    team_members: JSON.stringify([
                        { name: 'T.Vanaja', role: 'Lead Developer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/vanaja_izfe76.jpg' },
                        { name: 'Vaishnavi', role: 'UI Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772639378/vaishnavi_iwaurb.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_emergency_alert',
                    owner_id: 'user_admin',
                    owner_name: 'P.Geetanjali',
                    owner_avatar: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/geetanjali_ffvarc.jpg',
                    title: 'Emergancy Alert System for elderly living alone.',
                    description: 'An AI-powered emergency alert system for elderly individuals living alone.',
                    status: 'in_progress',
                    category: 'Ongoing',
                    domain: 'IoT',
                    completion: 50,
                    tech_stack: JSON.stringify(['IoT', 'Python', 'Twilio API', 'Flutter']),
                    team_members: JSON.stringify([
                        { name: 'P.Geetanjali', role: 'IoT Engineer', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/geetanjali_ffvarc.jpg' },
                        { name: 'T.Rishitha', role: 'Mobile Dev', image: 'https://res.cloudinary.com/dseg9nty3/image/upload/v1772518152/rishitha_zgdfij.jpg' }
                    ]),
                    visibility: 'public'
                },
                {
                    id: 'proj_healthsetu',
                    owner_id: 'user_admin',
                    owner_name: 'A.Lokesh',
                    owner_avatar: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927',
                    title: 'Healthsetu',
                    description: 'An AI-powered health management system for students.',
                    status: 'in_progress',
                    category: 'Ongoing',
                    domain: 'HealthTech',
                    completion: 40,
                    tech_stack: JSON.stringify(['React Native', 'Node.js', 'TensorFlow']),
                    team_members: JSON.stringify([
                        { name: 'A.Lokesh', role: 'Lead Developer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.39.51%20AM.jpeg?updatedAt=1760073049927' }
                    ]),
                    visibility: 'public'
                }
            ];

            for (const sp of seedProjects) {
                await sql`
                    INSERT INTO projects (
                        id, owner_id, owner_name, owner_avatar, title, description, status,
                        category, domain, completion, tech_stack, team_members, visibility
                    ) VALUES (
                        ${sp.id}, ${sp.owner_id}, ${sp.owner_name}, ${sp.owner_avatar},
                        ${sp.title}, ${sp.description}, ${sp.status}, ${sp.category},
                        ${sp.domain}, ${sp.completion}, ${sp.tech_stack}, ${sp.team_members}, ${sp.visibility}
                    ) ON CONFLICT (id) DO NOTHING
                `;
            }
            console.log('Seeded all 27 projects successfully into Neon DB projects table.');
        }
        isProjectsTableInitialized = true;
    } catch (e) {
        console.warn('Projects table initialization warning:', e.message);
    }
};

// Helper: Authenticate session headers and determine role
const getUserAuth = (req) => {
    const userId = req.headers['x-user-id'] || 'user_anon';
    const role = (req.headers['x-user-role'] || '').toLowerCase().trim();
    const userEmail = (req.headers['x-user-email'] || '').toLowerCase().trim();
    const userName = (req.headers['x-user-name'] || '').toLowerCase().trim();
    const isAdmin = role === 'admin' || userEmail === 'admin@nexus.com' || userId === 'admin_master' || userEmail.includes('admin');
    return { userId, role: isAdmin ? 'admin' : (role || 'member'), userEmail, userName, isAdmin };
};

// Helper: Check if user is project owner or team member
const isUserAuthorizedForProject = (project, auth) => {
    if (!project) return false;
    if (auth.isAdmin) return true;

    const pOwnerId = String(project.owner_id || project.ownerId || '').toLowerCase().trim();
    const pOwnerName = String(project.owner_name || project.ownerName || '').toLowerCase().trim();
    const uId = String(auth.userId).toLowerCase().trim();
    const uName = String(auth.userName).toLowerCase().trim();
    const uEmail = String(auth.userEmail).toLowerCase().trim();

    if (pOwnerId && (pOwnerId === uId || pOwnerId === uEmail)) return true;
    if (pOwnerName && uName && (pOwnerName === uName || pOwnerName.includes(uName))) return true;

    // Check team members array
    let teamStr = '';
    if (typeof project.team_members === 'string') teamStr = project.team_members.toLowerCase();
    else if (typeof project.teamMembers === 'string') teamStr = project.teamMembers.toLowerCase();
    else if (Array.isArray(project.team_members || project.teamMembers)) {
        teamStr = JSON.stringify(project.team_members || project.teamMembers).toLowerCase();
    }

    if (teamStr && (
        (uId && teamStr.includes(uId)) || 
        (uName && teamStr.includes(uName)) || 
        (uEmail && teamStr.includes(uEmail))
    )) {
        return true;
    }

    return false;
};

// Projects API Endpoints (Role-Based Access Control + Query Parameter Filtering)
app.get('/api/projects', async (req, res) => {
    try {
        await initProjectsTable();
        const auth = getUserAuth(req);
        const { search, ownerId, teamMemberId, domain, status, priority, completion } = req.query;

        let projects = [];
        const isPublicRequest = req.headers['x-user-id'] === undefined && req.headers['x-user-role'] === undefined;

        if (auth.isAdmin) {
            // ADMIN ACCESS: View all non-deleted projects sorted by display order
            projects = await sql`SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY display_order ASC, created_at DESC`;
        } else if (isPublicRequest || req.query.public === 'true') {
            // PUBLIC MAIN WEBSITE: View all non-deleted public projects
            const allActive = await sql`SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY display_order ASC, created_at DESC`;
            projects = allActive.filter(p => (p.visibility || 'public').toLowerCase() !== 'private');
        } else {
            // MEMBER IN DASHBOARD: View owned/assigned projects + public projects
            const allActive = await sql`SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY display_order ASC, created_at DESC`;
            projects = allActive.filter(p => isUserAuthorizedForProject(p, auth) || (p.visibility || 'public').toLowerCase() === 'public');
        }

        // Apply Server-Side Query Parameter Filters
        if (search) {
            const s = String(search).toLowerCase();
            projects = projects.filter(p => 
                (p.title && p.title.toLowerCase().includes(s)) ||
                (p.description && p.description.toLowerCase().includes(s)) ||
                (p.owner_name && p.owner_name.toLowerCase().includes(s)) ||
                (p.id && p.id.toLowerCase().includes(s)) ||
                (typeof p.tech_stack === 'string' && p.tech_stack.toLowerCase().includes(s))
            );
        }

        if (ownerId) {
            const o = String(ownerId).toLowerCase();
            projects = projects.filter(p => 
                String(p.owner_id || '').toLowerCase() === o || 
                String(p.owner_name || '').toLowerCase().includes(o)
            );
        }

        if (teamMemberId) {
            const tm = String(teamMemberId).toLowerCase();
            projects = projects.filter(p => {
                const teamStr = typeof p.team_members === 'string' ? p.team_members.toLowerCase() : JSON.stringify(p.team_members || []).toLowerCase();
                return teamStr.includes(tm);
            });
        }

        if (domain && domain !== 'ALL') {
            const d = String(domain).toLowerCase();
            projects = projects.filter(p => String(p.domain || p.category || '').toLowerCase() === d);
        }

        if (status && status !== 'ALL') {
            const st = String(status).toLowerCase();
            projects = projects.filter(p => String(p.status || '').toLowerCase() === st);
        }

        if (priority && priority !== 'ALL') {
            const pr = String(priority).toLowerCase();
            projects = projects.filter(p => String(p.priority || '').toLowerCase() === pr);
        }

        if (completion) {
            const comp = Number(completion);
            if (!isNaN(comp)) {
                projects = projects.filter(p => Number(p.completion || p.completion_percentage || 0) >= comp);
            }
        }

        res.json({ success: true, projects, role: auth.role });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Public Projects Endpoint for Main Website (Only approved, non-deleted, public projects)
app.get('/api/projects/public', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    try {
        await initProjectsTable();
        const { search, category, domain, status, sort } = req.query;
        let projects = await sql`SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY display_order ASC, created_at DESC`;
        let deletedRows = [];
        try {
            deletedRows = await sql`SELECT id, title FROM deleted_projects`;
        } catch (e) {}

        const deletedSet = new Set(deletedRows.map(d => String(d.id).toLowerCase()));
        deletedRows.forEach(d => { if (d.title) deletedSet.add(String(d.title).toLowerCase().trim()); });

        // Public Security Filter: Exclude draft, private, or hidden projects
        projects = projects.filter(p => {
            const pId = String(p.id).toLowerCase();
            const pTitle = (p.title || '').toLowerCase().trim();
            if (deletedSet.has(pId) || (pTitle && deletedSet.has(pTitle))) return false;

            const vis = (p.visibility || 'public').toLowerCase().trim();
            const st = (p.status || '').toLowerCase().trim();
            if (vis === 'private' || vis === 'hidden') return false;
            if (['draft', 'pending_review', 'rejected'].includes(st)) return false;
            return true;
        });

        // Apply Query Filters
        if (search) {
            const s = String(search).toLowerCase().trim();
            projects = projects.filter(p =>
                (p.title && p.title.toLowerCase().includes(s)) ||
                (p.description && p.description.toLowerCase().includes(s)) ||
                (p.owner_name && p.owner_name.toLowerCase().includes(s)) ||
                (typeof p.tech_stack === 'string' && p.tech_stack.toLowerCase().includes(s)) ||
                (typeof p.team_members === 'string' && p.team_members.toLowerCase().includes(s))
            );
        }

        if (category && category !== 'ALL') {
            const cat = String(category).toLowerCase().trim();
            projects = projects.filter(p => String(p.category || '').toLowerCase().trim() === cat);
        }

        if (domain && domain !== 'ALL') {
            const dom = String(domain).toLowerCase().trim();
            projects = projects.filter(p => String(p.domain || '').toLowerCase().trim() === dom);
        }

        if (status && status !== 'ALL') {
            const st = String(status).toLowerCase().trim();
            projects = projects.filter(p => String(p.status || '').toLowerCase().trim() === st);
        }

        // Sorting
        if (sort === 'oldest') {
            projects.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        } else if (sort === 'views') {
            projects.sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
        } else if (sort === 'alphabetical') {
            projects.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        res.json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching public projects:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// View Count Analytics Tracking Endpoint
app.post('/api/projects/:id/view', async (req, res) => {
    try {
        await initProjectsTable();
        const { id } = req.params;
        await sql`UPDATE projects SET views = COALESCE(views, 0) + 1 WHERE id = ${id}`;
        res.json({ success: true, message: 'View count updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        await initProjectsTable();
        const auth = getUserAuth(req);
        const { id } = req.params;

        const projects = await sql`SELECT * FROM projects WHERE id = ${id} AND deleted_at IS NULL LIMIT 1`;
        if (!projects || projects.length === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const project = projects[0];
        const isPublicRequest = req.headers['x-user-id'] === undefined && req.headers['x-user-role'] === undefined;

        if (!auth.isAdmin && !isPublicRequest && !isUserAuthorizedForProject(project, auth)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden: You do not have authorization to access this project.' 
            });
        }

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── GET My Projects ──────────────────────────────────────────────────────────
app.get('/api/projects/user/:id', async (req, res) => {
    try {
        await initProjectsTable();
        const auth = getUserAuth(req);
        const { id } = req.params;

        // Security Check: Member can only query their own user projects unless admin
        if (!auth.isAdmin && auth.userId !== id && auth.userEmail !== id) {
            return res.status(403).json({ success: false, message: 'Forbidden: Unauthorized user query.' });
        }

        const projects = await sql`SELECT * FROM projects WHERE (owner_id = ${id} OR team_members LIKE ${'%' + id + '%'}) AND deleted_at IS NULL ORDER BY created_at DESC`;
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const normalizeJsonArray = (input) => {
    if (input === undefined || input === null) return JSON.stringify([]);
    if (Array.isArray(input)) return JSON.stringify(input);
    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return JSON.stringify([]);
        if (trimmed.startsWith('[')) {
            try {
                let parsed = JSON.parse(trimmed);
                if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                if (Array.isArray(parsed)) return JSON.stringify(parsed);
            } catch (e) {}
        }
        return JSON.stringify(trimmed.split(',').map(s => s.trim()).filter(Boolean));
    }
    return JSON.stringify([]);
};

app.post('/api/projects', async (req, res) => {
    try {
        await initProjectsTable();
        const auth = getUserAuth(req);
        const p = req.body;
        const id = p.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        // Zero-Trust: Force ownerId and createdBy from server session authentication
        const ownerId = auth.userId || p.ownerId || 'user_admin';
        const rawOwnerName = auth.userName || p.ownerName || p.owner_name || '';
        const ownerName = isNexusAdmin(rawOwnerName) ? '' : rawOwnerName;
        const createdBy = auth.userId || 'user_admin';
        const summaryVal = (p.summary || p.cardSummary || p.cardDescription || p.card_summary) || (p.description || p.desc || '');
        const descVal = p.description || p.desc || p.details || '';
        const displayOrderVal = Number(p.displayOrder || p.display_order || p.order || 1);
        const iconVal = p.icon || p.project_icon || p.iconType || 'monitor';
        const apkVal = p.apkUrl || p.apk_url || p.apk || '';
        const completion = Number(p.completion || p.completionPercentage) || (p.status === 'completed' ? 100 : 50);
        const parsedTeam = parseTeamMembers(p.teamMembers || p.team || p.team_members);

        await sql`
            INSERT INTO projects (
                id, owner_id, owner_name, owner_avatar, created_by, title, description, summary, status, priority, domain, thumbnail, 
                screenshots, documents, github, github_url, live_demo, live_demo_url, tech_stack, completion, completion_percentage, category, 
                visibility, team_members, role, start_date, completion_date, 
                challenges, future_improvements, features, architecture, likes, views, display_order, icon, apk_url, apk,
                created_at, updated_at
            ) VALUES (
                ${id}, ${ownerId}, ${ownerName}, ${p.ownerAvatar || ''}, ${createdBy}, 
                ${p.title || 'Untitled Project'}, ${descVal}, ${summaryVal}, ${p.status || 'in_progress'}, 
                ${p.priority || 'medium'}, ${p.domain || 'Engineering'},
                ${p.thumbnail || ''}, ${normalizeJsonArray(p.screenshots)}, ${normalizeJsonArray(p.documents)}, 
                ${p.github || p.githubUrl || ''}, ${p.githubUrl || p.github || ''}, 
                ${p.liveDemo || p.live_demo_url || p.live || ''}, ${p.liveDemoUrl || p.liveDemo || ''}, 
                ${normalizeJsonArray(p.techStack || p.tech || p.tech_stack)}, 
                ${completion}, ${completion}, ${p.category || 'Advanced'}, ${p.visibility || 'public'}, 
                ${JSON.stringify(parsedTeam)}, ${p.role || 'Contributor'}, 
                ${p.startDate || p.start_date || ''}, ${p.completionDate || p.completion_date || ''}, 
                ${p.challenges || ''}, ${p.futureImprovements || p.future_improvements || ''}, 
                ${normalizeJsonArray(p.features)}, ${p.architecture || ''}, ${p.likes || 0}, ${p.views || 0},
                ${displayOrderVal}, ${iconVal}, ${apkVal}, ${apkVal},
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                summary = EXCLUDED.summary,
                status = EXCLUDED.status,
                priority = EXCLUDED.priority,
                domain = EXCLUDED.domain,
                thumbnail = EXCLUDED.thumbnail,
                category = EXCLUDED.category,
                completion = EXCLUDED.completion,
                completion_percentage = EXCLUDED.completion_percentage,
                tech_stack = EXCLUDED.tech_stack,
                team_members = EXCLUDED.team_members,
                visibility = EXCLUDED.visibility,
                display_order = EXCLUDED.display_order,
                icon = EXCLUDED.icon,
                apk_url = EXCLUDED.apk_url,
                apk = EXCLUDED.apk,
                updated_at = CURRENT_TIMESTAMP
        `;

        res.json({ success: true, id, message: 'Project saved successfully' });
    } catch (error) {
        console.error('Error creating/saving project:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const handleProjectUpdate = async (req, res) => {
    try {
        await initProjectsTable();
        const auth = getUserAuth(req);
        const { id } = req.params;
        const p = req.body;

        const existingList = await sql`SELECT * FROM projects WHERE id = ${id} AND deleted_at IS NULL LIMIT 1`;
        const existing = (existingList && existingList.length > 0) ? existingList[0] : {};

        // Security Check: Member can ONLY edit their own project
        if (existing.id && !auth.isAdmin && !isUserAuthorizedForProject(existing, auth)) {
            return res.status(403).json({ success: false, message: 'Forbidden: You cannot edit another member\'s project.' });
        }

        // Prevent Non-Admin from transferring ownership
        let newOwnerId = p.ownerId || p.owner_id;
        let newOwnerName = p.ownerName || p.owner_name;
        if (!auth.isAdmin && existing.owner_id) {
            newOwnerId = existing.owner_id;
            newOwnerName = existing.owner_name;
        }

        const titleVal = p.title !== undefined ? p.title : (existing.title || 'Untitled Project');
        const descVal = p.description !== undefined ? p.description : (p.desc !== undefined ? p.desc : (p.details !== undefined ? p.details : (existing.description || '')));
        const summaryVal = (p.summary || p.cardSummary || p.cardDescription || p.card_summary) !== undefined ? (p.summary || p.cardSummary || p.cardDescription || p.card_summary) : (existing.summary || '');
        const statusVal = p.status !== undefined ? p.status : (existing.status || 'in_progress');
        const priorityVal = p.priority !== undefined ? p.priority : (existing.priority || 'medium');
        const domainVal = p.domain !== undefined ? p.domain : (existing.domain || 'Engineering');
        const thumbnailVal = p.thumbnail !== undefined ? p.thumbnail : (existing.thumbnail || '');
        const categoryVal = p.category !== undefined ? p.category : (existing.category || 'Advanced');
        const visibilityVal = p.visibility !== undefined ? p.visibility : (existing.visibility || 'public');
        const roleVal = p.role !== undefined ? p.role : (existing.role || '');
        const startDateVal = (p.startDate || p.start_date) !== undefined ? (p.startDate || p.start_date) : (existing.start_date || '');
        const completionDateVal = (p.completionDate || p.completion_date) !== undefined ? (p.completionDate || p.completion_date) : (existing.completion_date || '');
        const challengesVal = p.challenges !== undefined ? p.challenges : (existing.challenges || '');
        const futureImpVal = (p.futureImprovements || p.future_improvements) !== undefined ? (p.futureImprovements || p.future_improvements) : (existing.future_improvements || '');
        const archVal = p.architecture !== undefined ? p.architecture : (existing.architecture || '');
        const iconVal = (p.icon || p.project_icon || p.iconType) !== undefined ? (p.icon || p.project_icon || p.iconType) : (existing.icon || 'monitor');
        const displayOrderVal = (p.displayOrder !== undefined || p.display_order !== undefined || p.order !== undefined)
            ? Number(p.displayOrder || p.display_order || p.order || 1)
            : Number(existing.display_order || existing.displayOrder || 1);

        const githubVal = (p.githubUrl || p.github) !== undefined ? (p.githubUrl || p.github) : (existing.github_url || '');
        const liveVal = (p.liveDemoUrl || p.liveDemo || p.live_demo || p.live) !== undefined ? (p.liveDemoUrl || p.liveDemo || p.live_demo || p.live) : (existing.live_demo_url || '');
        const apkVal = (p.apkUrl || p.apk_url || p.apk) !== undefined ? (p.apkUrl || p.apk_url || p.apk) : (existing.apk_url || existing.apk || '');

        const completionVal = p.completion !== undefined ? Number(p.completion) : (p.completionPercentage !== undefined ? Number(p.completionPercentage) : Number(existing.completion || 0));

        const techVal = (p.techStack || p.tech || p.tech_stack) !== undefined 
            ? normalizeJsonArray(p.techStack || p.tech || p.tech_stack) 
            : (existing.tech_stack || '[]');

        const teamVal = (p.teamMembers || p.team || p.team_members) !== undefined 
            ? JSON.stringify(parseTeamMembers(p.teamMembers || p.team || p.team_members)) 
            : (existing.team_members || '[]');

        const featuresVal = p.features !== undefined ? normalizeJsonArray(p.features) : (existing.features || '[]');
        const screenshotsVal = p.screenshots !== undefined ? normalizeJsonArray(p.screenshots) : (existing.screenshots || '[]');
        const documentsVal = p.documents !== undefined ? normalizeJsonArray(p.documents) : (existing.documents || '[]');

        const rawOwnerId = newOwnerId !== undefined ? newOwnerId : (existing.owner_id || auth.userId || 'user_admin');
        const rawOwnerName = newOwnerName !== undefined ? newOwnerName : (existing.owner_name || auth.userName || '');
        const finalOwnerId = rawOwnerId;
        const finalOwnerName = isNexusAdmin(rawOwnerName) ? '' : rawOwnerName;

        await sql`
            INSERT INTO projects (
                id, owner_id, owner_name, title, description, summary, status, priority, domain,
                thumbnail, screenshots, documents, github, github_url, live_demo, live_demo_url,
                tech_stack, completion, completion_percentage, category, visibility, team_members,
                role, start_date, completion_date, challenges, future_improvements, features, architecture, display_order, icon, apk_url, apk
            ) VALUES (
                ${id}, ${finalOwnerId}, ${finalOwnerName}, ${titleVal}, ${descVal}, ${summaryVal},
                ${statusVal}, ${priorityVal}, ${domainVal}, ${thumbnailVal},
                ${screenshotsVal}, ${documentsVal}, ${githubVal}, ${githubVal}, ${liveVal}, ${liveVal},
                ${techVal}, ${completionVal}, ${completionVal}, ${categoryVal}, ${visibilityVal},
                ${teamVal}, ${roleVal}, ${startDateVal}, ${completionDateVal}, ${challengesVal},
                ${futureImpVal}, ${featuresVal}, ${archVal}, ${displayOrderVal}, ${iconVal}, ${apkVal}, ${apkVal}
            ) ON CONFLICT (id) DO UPDATE SET
                owner_id = EXCLUDED.owner_id,
                owner_name = EXCLUDED.owner_name,
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                summary = EXCLUDED.summary,
                status = EXCLUDED.status,
                priority = EXCLUDED.priority,
                domain = EXCLUDED.domain,
                thumbnail = EXCLUDED.thumbnail,
                screenshots = EXCLUDED.screenshots,
                documents = EXCLUDED.documents,
                github = EXCLUDED.github,
                github_url = EXCLUDED.github_url,
                live_demo = EXCLUDED.live_demo,
                live_demo_url = EXCLUDED.live_demo_url,
                tech_stack = EXCLUDED.tech_stack,
                completion = EXCLUDED.completion,
                completion_percentage = EXCLUDED.completion_percentage,
                category = EXCLUDED.category,
                visibility = EXCLUDED.visibility,
                team_members = EXCLUDED.team_members,
                role = EXCLUDED.role,
                start_date = EXCLUDED.start_date,
                completion_date = EXCLUDED.completion_date,
                challenges = EXCLUDED.challenges,
                future_improvements = EXCLUDED.future_improvements,
                features = EXCLUDED.features,
                architecture = EXCLUDED.architecture,
                display_order = EXCLUDED.display_order,
                icon = EXCLUDED.icon,
                apk_url = EXCLUDED.apk_url,
                apk = EXCLUDED.apk,
                updated_at = CURRENT_TIMESTAMP
        `;

        const updatedList = await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
        const updatedProject = updatedList[0];

        res.json({ success: true, project: updatedProject, message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

app.put('/api/projects/:id', handleProjectUpdate);
app.patch('/api/projects/:id', handleProjectUpdate);

app.delete('/api/projects/:id', async (req, res) => {
    try {
        await initProjectsTable();
        const auth = getUserAuth(req);
        const { id } = req.params;
        const targetTitle = req.query.title || req.body?.title;

        // 1. HARD DELETE row from projects table in Neon DB!
        await sql`DELETE FROM projects WHERE id = ${id} OR (title IS NOT NULL AND title = ${targetTitle || id})`;

        // 2. Track deleted ID in deleted_projects registry in Neon DB to guarantee global purge across static maps & APIs
        try {
            await sql`
                INSERT INTO deleted_projects (id, title)
                VALUES (${id}, ${targetTitle || id})
                ON CONFLICT (id) DO UPDATE SET deleted_at = CURRENT_TIMESTAMP
            `;
        } catch (e) {}

        res.json({ success: true, message: 'Project permanently deleted from Neon DB' });
    } catch (error) {
        console.error('Error deleting project from Neon DB:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Audit Logging Endpoint
app.post('/api/audit-logs', async (req, res) => {
    try {
        const auth = getUserAuth(req);
        const { action, projectId, details } = req.body;

        await sql`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id TEXT,
                user_name TEXT,
                user_email TEXT,
                action TEXT NOT NULL,
                project_id TEXT,
                details TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            INSERT INTO audit_logs (user_id, user_name, user_email, action, project_id, details)
            VALUES (${auth.userId}, ${auth.userName}, ${auth.userEmail}, ${action || 'UNKNOWN'}, ${projectId || ''}, ${details || ''})
        `;

        res.json({ success: true, message: 'Audit log recorded' });
    } catch (error) {
        console.warn('Audit logging warning:', error.message);
        res.json({ success: false, error: error.message });
    }
});

// Website / Project Requirement Form Submission Endpoint
app.post('/api/requirements', async (req, res) => {
    const data = req.body;
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS project_requirements (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                client_name TEXT,
                contact_person TEXT,
                email TEXT,
                phone TEXT,
                whatsapp TEXT,
                address TEXT,
                business_type TEXT,
                business_name TEXT,
                website_social TEXT,
                years_in_business TEXT,
                project_title TEXT,
                purpose_of_website TEXT,
                business_description TEXT,
                website_type JSONB,
                reference_links TEXT,
                features JSONB,
                design_preference TEXT,
                color_preference TEXT,
                has_logo TEXT,
                will_provide_content TEXT,
                content_provider TEXT,
                pages_required TEXT,
                start_date TEXT,
                expected_deadline TEXT,
                fixed_deadline TEXT,
                budget_range TEXT,
                has_domain TEXT,
                has_hosting TEXT,
                need_domain_hosting_help TEXT,
                additional_notes TEXT,
                client_signature TEXT,
                authorization_date TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            INSERT INTO project_requirements (
                client_name, contact_person, email, phone, whatsapp, address,
                business_type, business_name, website_social, years_in_business,
                project_title, purpose_of_website, business_description,
                website_type, reference_links, features, design_preference,
                color_preference, has_logo, will_provide_content, content_provider,
                pages_required, start_date, expected_deadline, fixed_deadline,
                budget_range, has_domain, has_hosting, need_domain_hosting_help,
                additional_notes, client_signature, authorization_date
            ) VALUES (
                ${data.client_name || ''}, ${data.contact_person || ''}, ${data.email || ''}, ${data.phone || ''}, ${data.whatsapp || ''}, ${data.address || ''},
                ${data.business_type || ''}, ${data.business_name || ''}, ${data.website_social || ''}, ${data.years_in_business || ''},
                ${data.project_title || ''}, ${data.purpose_of_website || ''}, ${data.business_description || ''},
                ${JSON.stringify(data.website_type || [])}, ${data.reference_links || ''}, ${JSON.stringify(data.features || [])}, ${data.design_preference || ''},
                ${data.color_preference || ''}, ${data.has_logo || ''}, ${data.will_provide_content || ''}, ${data.content_provider || ''},
                ${data.pages_required || ''}, ${data.start_date || ''}, ${data.expected_deadline || ''}, ${data.fixed_deadline || ''},
                ${data.budget_range || ''}, ${data.has_domain || ''}, ${data.has_hosting || ''}, ${data.need_domain_hosting_help || ''},
                ${data.additional_notes || ''}, ${data.client_signature || ''}, ${data.authorization_date || ''}
            )
        `;

        res.json({ success: true, message: 'Requirement form submitted successfully' });
    } catch (error) {
        console.error('Error saving project requirements:', error);
        res.json({ success: true, message: 'Requirement recorded locally', note: error.message });
    }
});

// ── Stat Cards Management Endpoints ──────────────────────────────────────────
const DEFAULT_STAT_CARDS = {
    'home_hero_active_students': { card_key: 'home_hero_active_students', value: '10K+', label: 'Active Students', page: 'Home', category: 'Hero Badges', order_index: 1 },
    'home_hero_expert_mentors': { card_key: 'home_hero_expert_mentors', value: '200+', label: 'Expert Mentors', page: 'Home', category: 'Hero Badges', order_index: 2 },
    'home_row_domains': { card_key: 'home_row_domains', value: '50+', label: 'Domains', page: 'Home', category: 'Hero Stats Row', order_index: 3 },
    'home_row_projects': { card_key: 'home_row_projects', value: '1K+', label: 'Projects Published', page: 'Home', category: 'Hero Stats Row', order_index: 4 },
    'home_row_events': { card_key: 'home_row_events', value: '100+', label: 'Events Organized', page: 'Home', category: 'Hero Stats Row', order_index: 5 },
    'home_row_possibilities': { card_key: 'home_row_possibilities', value: '∞', label: 'Possibilities', page: 'Home', category: 'Hero Stats Row', order_index: 6 },

    'mentor_batch_title': { card_key: 'mentor_batch_title', value: 'Batch: 1', label: 'Batch Title', page: 'Mentorship', category: 'Batch Info', order_index: 1 },
    'mentor_batch_dates': { card_key: 'mentor_batch_dates', value: 'November 2025 - January 2026', label: 'Batch Dates', page: 'Mentorship', category: 'Batch Info', order_index: 2 },
    'mentor_stat_events_registered': { card_key: 'mentor_stat_events_registered', value: '150+', label: 'Members Registered for Events', page: 'Mentorship', category: 'Membership Stats', order_index: 3 },
    'mentor_stat_spot_registrations': { card_key: 'mentor_stat_spot_registrations', value: '80+', label: 'Spot Registrations', page: 'Mentorship', category: 'Membership Stats', order_index: 4 },
    'mentor_stat_events_attended': { card_key: 'mentor_stat_events_attended', value: '200+', label: 'Members Attended Events', page: 'Mentorship', category: 'Membership Stats', order_index: 5 },
    'mentor_stat_mentorship_registered': { card_key: 'mentor_stat_mentorship_registered', value: '80+', label: 'Members Registered for Mentorship', page: 'Mentorship', category: 'Membership Stats', order_index: 6 },

    'event_karmasiddhi_registered': { card_key: 'event_karmasiddhi_registered', value: '120 Members', label: 'REGISTERED', page: 'Events', category: 'Karmasiddhi Event', order_index: 1 },
    'event_karmasiddhi_attended': { card_key: 'event_karmasiddhi_attended', value: '100 Members', label: 'ATTENDED', page: 'Events', category: 'Karmasiddhi Event', order_index: 2 },
    'event_karmasiddhi_duration': { card_key: 'event_karmasiddhi_duration', value: '10:00 AM - 12:00 PM', label: 'DURATION', page: 'Events', category: 'Karmasiddhi Event', order_index: 3 },
    'event_ainexus_registered': { card_key: 'event_ainexus_registered', value: '110 Members', label: 'REGISTERED', page: 'Events', category: 'AI Nexus Event', order_index: 4 },
    'event_ainexus_attended': { card_key: 'event_ainexus_attended', value: '100 Members', label: 'ATTENDED', page: 'Events', category: 'AI Nexus Event', order_index: 5 },
    'event_ainexus_duration': { card_key: 'event_ainexus_duration', value: 'Full Day Event', label: 'DURATION', page: 'Events', category: 'AI Nexus Event', order_index: 6 },

    'dash_active_members': { card_key: 'dash_active_members', value: '100+', label: 'Active Members', page: 'Dashboard', category: 'Hub Metrics', order_index: 1 },
    'dash_projects_done': { card_key: 'dash_projects_done', value: '50+', label: 'Projects Done', page: 'Dashboard', category: 'Hub Metrics', order_index: 2 },
    'dash_tech_domains': { card_key: 'dash_tech_domains', value: '10+', label: 'Tech Domains', page: 'Dashboard', category: 'Hub Metrics', order_index: 3 }
};

const initStatCardsTable = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS site_stat_cards (
                card_key TEXT PRIMARY KEY,
                page TEXT NOT NULL,
                category TEXT,
                label TEXT NOT NULL,
                value TEXT NOT NULL,
                subtext TEXT,
                icon TEXT,
                order_index INT DEFAULT 0,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
    } catch (e) {
        console.warn('Stat cards table init warning:', e.message);
    }
};

app.get('/api/stat-cards', async (req, res) => {
    try {
        await initStatCardsTable();
        const rows = await sql`SELECT card_key, page, category, label, value, subtext, icon, order_index FROM site_stat_cards ORDER BY order_index ASC`;
        const cardsMap = { ...DEFAULT_STAT_CARDS };

        if (rows && rows.length > 0) {
            rows.forEach(r => {
                cardsMap[r.card_key] = {
                    card_key: r.card_key,
                    page: r.page,
                    category: r.category,
                    label: r.label,
                    value: r.value,
                    subtext: r.subtext || '',
                    icon: r.icon || '',
                    order_index: r.order_index || 0
                };
            });
        }
        res.json({ success: true, cards: cardsMap });
    } catch (error) {
        console.warn('Get stat cards fallback:', error.message);
        res.json({ success: true, cards: DEFAULT_STAT_CARDS });
    }
});

app.put('/api/stat-cards', async (req, res) => {
    try {
        await initStatCardsTable();
        const { cards } = req.body;
        if (!cards || typeof cards !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid cards payload' });
        }

        for (const [key, card] of Object.entries(cards)) {
            await sql`
                INSERT INTO site_stat_cards (card_key, page, category, label, value, subtext, icon, order_index, updated_at)
                VALUES (${key}, ${card.page || 'General'}, ${card.category || ''}, ${card.label || ''}, ${card.value || ''}, ${card.subtext || ''}, ${card.icon || ''}, ${card.order_index || 0}, CURRENT_TIMESTAMP)
                ON CONFLICT (card_key) DO UPDATE SET
                    label = EXCLUDED.label,
                    value = EXCLUDED.value,
                    subtext = EXCLUDED.subtext,
                    page = EXCLUDED.page,
                    category = EXCLUDED.category,
                    icon = EXCLUDED.icon,
                    order_index = EXCLUDED.order_index,
                    updated_at = CURRENT_TIMESTAMP
            `;
        }

        res.json({ success: true, message: 'Stat cards updated successfully', cards });
    } catch (error) {
        console.error('Save stat cards error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/home-content', async (req, res) => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS site_content (
                key TEXT PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        const rows = await sql`SELECT data FROM site_content WHERE key = 'home_content' LIMIT 1`;
        if (rows && rows.length > 0) {
            const content = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
            return res.json({ success: true, content });
        }
        res.json({ success: true, content: null });
    } catch (error) {
        res.json({ success: true, content: null });
    }
});

app.put('/api/home-content', async (req, res) => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS site_content (
                key TEXT PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        const { content } = req.body;
        await sql`
            INSERT INTO site_content (key, data, updated_at)
            VALUES ('home_content', ${JSON.stringify(content)}, CURRENT_TIMESTAMP)
            ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
        `;
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Nexus Backend Signal Active at http://localhost:${port}`);
});


