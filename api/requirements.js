import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbUrl = process.env.DATABASE_URL || process.env.VITE_NEON_URL;
  if (!dbUrl) {
    return res.status(500).json({ success: false, message: 'Database connection string not configured' });
  }
  const sql = neon(dbUrl);

  try {
    if (req.method === 'POST') {
      const data = req.body || {};

      await sql`
        CREATE TABLE IF NOT EXISTS freelancing (
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
          website_type TEXT,
          reference_links TEXT,
          features TEXT,
          other_features TEXT,
          design_preference TEXT,
          color_preference TEXT,
          has_logo TEXT,
          will_provide_content TEXT,
          content_provider TEXT,
          pages_required TEXT,
          start_date TEXT,
          expected_deadline TEXT,
          fixed_deadline TEXT,
          fixed_deadline_details TEXT,
          budget_range TEXT,
          has_domain TEXT,
          has_hosting TEXT,
          need_domain_hosting_help TEXT,
          additional_notes TEXT,
          client_signature TEXT,
          authorization_date TEXT,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const getVal = (snakeKey, camelKey) => {
        const v = data[snakeKey] !== undefined ? data[snakeKey] : data[camelKey];
        if (Array.isArray(v)) return v.join(', ');
        return v || null;
      };

      await sql`
        INSERT INTO freelancing (
          client_name, contact_person, email, phone, whatsapp, address,
          business_type, business_name, website_social, years_in_business,
          project_title, purpose_of_website, business_description,
          website_type, reference_links, features, other_features,
          design_preference, color_preference, has_logo, will_provide_content,
          content_provider, pages_required, start_date, expected_deadline,
          fixed_deadline, fixed_deadline_details, budget_range,
          has_domain, has_hosting, need_domain_hosting_help,
          additional_notes, client_signature, authorization_date
        ) VALUES (
          ${getVal('client_name', 'clientName')}, ${getVal('contact_person', 'contactPerson')}, ${getVal('email', 'email')}, ${getVal('phone', 'phone')}, ${getVal('whatsapp', 'whatsapp')}, ${getVal('address', 'address')},
          ${getVal('business_type', 'businessType')}, ${getVal('business_name', 'businessName')}, ${getVal('website_social', 'websiteSocial')}, ${getVal('years_in_business', 'yearsInBusiness')},
          ${getVal('project_title', 'projectTitle')}, ${getVal('purpose_of_website', 'purposeOfWebsite')}, ${getVal('business_description', 'businessDescription')},
          ${getVal('website_type', 'websiteType')}, ${getVal('reference_links', 'referenceLinks')}, ${getVal('features', 'features')}, ${getVal('other_features', 'otherFeatures')},
          ${getVal('design_preference', 'designPreference')}, ${getVal('color_preference', 'colorPreference')}, ${getVal('has_logo', 'hasLogo')}, ${getVal('will_provide_content', 'willProvideContent')},
          ${getVal('content_provider', 'contentProvider')}, ${getVal('pages_required', 'pagesRequired')}, ${getVal('start_date', 'startDate')}, ${getVal('expected_deadline', 'expectedDeadline')},
          ${getVal('fixed_deadline', 'fixedDeadline')}, ${getVal('fixed_deadline_details', 'fixedDeadlineDetails')}, ${getVal('budget_range', 'budgetRange')},
          ${getVal('has_domain', 'hasDomain')}, ${getVal('has_hosting', 'hasHosting')}, ${getVal('need_domain_hosting_help', 'needDomainHostingHelp')},
          ${getVal('additional_notes', 'additionalNotes')}, ${getVal('client_signature', 'clientSignature')}, ${getVal('authorization_date', 'authorizationDate')}
        )
      `;

      return res.status(200).json({
        success: true,
        message: '🚀 Project Requirements Secured! Our team will contact you shortly.'
      });
    }

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM freelancing ORDER BY created_at DESC`;
      return res.status(200).json({ success: true, data: rows });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Project Requirements API Error:', error);
    return res.status(500).json({ success: false, message: 'Database Error: ' + error.message });
  }
}
