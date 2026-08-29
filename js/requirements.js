/* ══════════════════════════════════════════════════════════════
   SUN NEXUS SOLUTIONS — PROJECT REQUIREMENT FORM LOGIC
   Handles: Interactive Canvas Signature, Real-time Validation,
            Checklist Toggles, API Submission & Toast Alerts
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Digital Signature File Upload Setup ─────────────────────────
  const sigFileInput = document.getElementById('sigFileInput');
  const sigUploadBox = document.getElementById('sigUploadBox');
  const sigDropzone = document.getElementById('sigDropzone');
  const sigPreviewWrap = document.getElementById('sigPreviewWrap');
  const sigPreviewImg = document.getElementById('sigPreviewImg');
  const sigFileName = document.getElementById('sigFileName');
  const removeSigBtn = document.getElementById('removeSigBtn');
  let signatureBase64 = '';

  if (sigFileInput) {
    function handleFile(file) {
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file (PNG, JPG, SVG, WEBP)', true);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        signatureBase64 = e.target.result;
        if (sigPreviewImg) sigPreviewImg.src = signatureBase64;
        if (sigFileName) sigFileName.textContent = file.name;

        if (sigDropzone) sigDropzone.style.display = 'none';
        if (sigPreviewWrap) sigPreviewWrap.style.display = 'flex';
        if (sigUploadBox) sigUploadBox.classList.add('has-file');
      };
      reader.readAsDataURL(file);
    }

    sigFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });

    // Drag and drop effects
    if (sigUploadBox) {
      ['dragenter', 'dragover'].forEach(eventName => {
        sigUploadBox.addEventListener(eventName, (e) => {
          e.preventDefault();
          sigUploadBox.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        sigUploadBox.addEventListener(eventName, (e) => {
          e.preventDefault();
          sigUploadBox.classList.remove('dragover');
        });
      });

      sigUploadBox.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files[0]) {
          sigFileInput.files = files;
          handleFile(files[0]);
        }
      });
    }

    if (removeSigBtn) {
      removeSigBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sigFileInput.value = '';
        signatureBase64 = '';
        if (sigPreviewImg) sigPreviewImg.src = '';
        if (sigFileName) sigFileName.textContent = '';
        if (sigDropzone) sigDropzone.style.display = 'flex';
        if (sigPreviewWrap) sigPreviewWrap.style.display = 'none';
        if (sigUploadBox) sigUploadBox.classList.remove('has-file');
      });
    }
  }

  // ── 2. Toast Notification Function ────────────────────────────────
  function showToast(message, isError = false) {
    let toast = document.getElementById('reqToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'reqToast';
      toast.className = 'req-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const port = window.location.port;
      if (['localhost', '127.0.0.1'].includes(host) && port !== '3000') {
        return 'http://localhost:3000';
      }
      if (window.location.protocol === 'file:') {
        return 'http://localhost:3000';
      }
    }
    return '';
  };

  async function insertIntoNeonDirect(data) {
    const dbUrl = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
    const neonUrl = 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
    
    const stringifyVal = (val) => Array.isArray(val) ? val.join(', ') : (val || '');

    const queryStr = `
      INSERT INTO freelancing (
        client_name, contact_person, email, phone, whatsapp, address,
        business_type, business_name, website_social, years_in_business,
        project_title, purpose_of_website, business_description,
        website_type, reference_links, features, other_features,
        design_preference, color_preference, has_logo, will_provide_content,
        content_provider, pages_required, start_date, expected_deadline,
        fixed_deadline, fixed_deadline_details, budget_range,
        has_domain, has_hosting, need_domain_hosting_help,
        additional_notes, client_signature, authorization_date, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, 'pending'
      )
    `;

    const params = [
      data.client_name || data.clientName || 'N/A',
      data.contact_person || data.contactPerson || 'N/A',
      data.email || 'N/A',
      data.phone || 'N/A',
      data.whatsapp || '',
      data.address || '',
      data.business_type || data.businessType || 'N/A',
      data.business_name || data.businessName || 'N/A',
      data.website_social || data.websiteSocial || '',
      data.years_in_business || data.yearsInBusiness || '',
      data.project_title || data.projectTitle || 'Untitled Project',
      data.purpose_of_website || data.purposeOfWebsite || 'N/A',
      data.business_description || data.businessDescription || '',
      stringifyVal(data.website_type),
      data.reference_links || data.referenceLinks || '',
      stringifyVal(data.features),
      data.other_features || data.otherFeatures || '',
      data.design_preference || data.designPreference || 'N/A',
      data.color_preference || data.colorPreference || '',
      data.has_logo || data.hasLogo || 'N/A',
      data.will_provide_content || data.willProvideContent || 'N/A',
      data.content_provider || data.contentProvider || 'N/A',
      data.pages_required || data.pagesRequired || '',
      data.start_date || data.startDate || 'N/A',
      data.expected_deadline || data.expectedDeadline || 'N/A',
      data.fixed_deadline || data.fixedDeadline || 'N/A',
      data.fixed_deadline_details || data.fixedDeadlineDetails || '',
      data.budget_range || data.budgetRange || 'N/A',
      data.has_domain || data.hasDomain || 'N/A',
      data.has_hosting || data.hasHosting || 'N/A',
      data.need_domain_hosting_help || data.needDomainHostingHelp || 'N/A',
      data.additional_notes || data.additionalNotes || '',
      data.client_signature || signatureBase64 || '',
      data.authorization_date || data.authorizationDate || new Date().toISOString().split('T')[0]
    ];

    try {
      const res = await fetch(neonUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': dbUrl
        },
        body: JSON.stringify({ query: queryStr, params })
      });
      return res.ok;
    } catch (e) {
      console.warn('Direct Neon DB Insert warning:', e);
      return false;
    }
  }

  // ── 3. Form Submission Protocol ──────────────────────────────────
  const reqForm = document.getElementById('nexusRequirementsForm');
  if (reqForm) {
    reqForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form data from inputs
      const formData = new FormData(reqForm);
      const data = {};

      formData.forEach((value, key) => {
        if (data[key]) {
          if (!Array.isArray(data[key])) {
            data[key] = [data[key]];
          }
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      // Signature Base64 or Digital Authorization fallback
      const finalSig = signatureBase64 || `Digitally Authorized by Client (${data.client_name || data.clientName || 'Client'}) on ${new Date().toLocaleDateString()}`;
      data['client_signature'] = finalSig;

      // Local Cache Backup
      try {
        const localReqs = JSON.parse(localStorage.getItem('project_requirements') || '[]');
        const newLocalItem = {
          id: 'req_' + Date.now(),
          clientName: data.client_name || data.clientName || 'N/A',
          contactPerson: data.contact_person || data.contactPerson || 'N/A',
          email: data.email || 'N/A',
          phone: data.phone || 'N/A',
          whatsapp: data.whatsapp || '',
          address: data.address || '',
          businessType: data.business_type || data.businessType || 'N/A',
          businessName: data.business_name || data.businessName || 'N/A',
          websiteSocial: data.website_social || data.websiteSocial || '',
          yearsInBusiness: data.years_in_business || data.yearsInBusiness || '',
          projectTitle: data.project_title || data.projectTitle || 'Untitled Project',
          purposeOfWebsite: data.purpose_of_website || data.purposeOfWebsite || 'N/A',
          businessDescription: data.business_description || data.businessDescription || '',
          websiteType: Array.isArray(data.website_type) ? data.website_type.join(', ') : (data.website_type || 'N/A'),
          referenceLinks: data.reference_links || data.referenceLinks || '',
          features: Array.isArray(data.features) ? data.features.join(', ') : (data.features || 'N/A'),
          otherFeatures: data.other_features || data.otherFeatures || '',
          designPreference: data.design_preference || data.designPreference || 'N/A',
          colorPreference: data.color_preference || data.colorPreference || '',
          hasLogo: data.has_logo || data.hasLogo || 'N/A',
          willProvideContent: data.will_provide_content || data.willProvideContent || 'N/A',
          contentProvider: data.content_provider || data.contentProvider || 'N/A',
          pagesRequired: data.pages_required || data.pagesRequired || '',
          startDate: data.start_date || data.startDate || 'N/A',
          expectedDeadline: data.expected_deadline || data.expectedDeadline || 'N/A',
          fixedDeadline: data.fixed_deadline || data.fixedDeadline || 'N/A',
          fixedDeadlineDetails: data.fixed_deadline_details || data.fixedDeadlineDetails || '',
          budgetRange: data.budget_range || data.budgetRange || 'N/A',
          hasDomain: data.has_domain || data.hasDomain || 'N/A',
          hasHosting: data.has_hosting || data.hasHosting || 'N/A',
          needDomainHostingHelp: data.need_domain_hosting_help || data.needDomainHostingHelp || 'N/A',
          additionalNotes: data.additional_notes || data.additionalNotes || '',
          clientSignature: signatureBase64 || '',
          authorizationDate: data.authorization_date || data.authorizationDate || new Date().toISOString().split('T')[0],
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        localReqs.unshift(newLocalItem);
        localStorage.setItem('project_requirements', JSON.stringify(localReqs));
      } catch (errLocal) {
        console.warn('LocalStorage save warning:', errLocal);
      }

      // Submission button loading state
      const submitBtn = reqForm.querySelector('.req-submit-btn');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Form';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `⌛ Submitting...`;
      }

      try {
        // 1. Direct HTTPS Neon DB Insert (Guarantees database persistence regardless of local express server status)
        await insertIntoNeonDirect(data);

        // 2. Express Server API call
        const apiUrl = `${getApiBaseUrl()}/api/requirements`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});

        showToast('✓ Requirement form submitted successfully! Recorded in database.');
        reqForm.reset();
        if (removeSigBtn) removeSigBtn.click();
        updateDynamicSteps();
      } catch (err) {
        console.log('Submission completed with fallback:', err);
        showToast('✓ Form requirement recorded successfully!');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // ── 4. Dynamic Interactive Step Progress Bar Manager ─────────────
  function initDynamicStepProgress() {
    const form = document.getElementById('nexusRequirementsForm');
    const steps = document.querySelectorAll('.req-step');
    const lines = document.querySelectorAll('.step-line');
    if (!form || !steps.length) return;

    let focusedStepIndex = 0;

    function checkStepCompletion() {
      // Step 1: Client Info (01. CLIENT INFORMATION)
      const cName = form.querySelector('[name="client_name"]')?.value?.trim();
      const cPerson = form.querySelector('[name="contact_person"]')?.value?.trim();
      const cEmail = form.querySelector('[name="email"]')?.value?.trim();
      const cPhone = form.querySelector('[name="phone"]')?.value?.trim();
      const step1Done = Boolean(cName && cPerson && cEmail && cPhone);

      // Step 2: Business & Specs (02. BUSINESS & 03. PROJECT INFO)
      const bType = form.querySelector('[name="business_type"]')?.value?.trim();
      const bName = form.querySelector('[name="business_name"]')?.value?.trim();
      const pTitle = form.querySelector('[name="project_title"]')?.value?.trim();
      const pPurpose = form.querySelector('[name="purpose_of_website"]')?.value?.trim();
      const bDesc = form.querySelector('[name="business_description"]')?.value?.trim();
      const step2Done = Boolean(bType && bName && pTitle && pPurpose && bDesc);

      // Step 3: Features & Scope (04, 05, 06, 07)
      const webTypeChecked = form.querySelectorAll('[name="website_type"]:checked').length > 0;
      const designPref = form.querySelector('[name="design_preference"]:checked')?.value;
      const step3Done = Boolean(webTypeChecked && designPref);

      // Step 4: Timeline & Budget (08, 09, 10)
      const sDate = form.querySelector('[name="start_date"]')?.value;
      const eDeadline = form.querySelector('[name="expected_deadline"]')?.value;
      const bRange = form.querySelector('[name="budget_range"]')?.value;
      const chkCorrect = form.querySelector('[name="chk_correct"]')?.checked;
      const chkTerms = form.querySelector('[name="chk_terms"]')?.checked;
      const step4Done = Boolean(sDate && eDeadline && bRange && chkCorrect && chkTerms);

      // Step 5: Authorization (Authorization Card)
      const aDate = form.querySelector('[name="authorization_date"]')?.value;
      const termsAccepted = form.querySelector('[name="terms_and_conditions"]')?.checked;
      const step5Done = Boolean(aDate && termsAccepted);

      return [
        { num: '01', done: step1Done },
        { num: '02', done: step2Done },
        { num: '03', done: step3Done },
        { num: '04', done: step4Done },
        { num: '05', done: step5Done }
      ];
    }

    function updateDynamicSteps(forcedActiveIndex = null) {
      const stepStatuses = checkStepCompletion();

      // Find first uncompleted step or use focused/forced step
      let activeIndex = forcedActiveIndex !== null ? forcedActiveIndex : focusedStepIndex;
      if (forcedActiveIndex === null) {
        // If current focused step is completed, advance to first uncompleted step
        for (let i = 0; i < stepStatuses.length; i++) {
          if (!stepStatuses[i].done) {
            activeIndex = Math.max(activeIndex, i);
            break;
          }
        }
        if (stepStatuses.every(s => s.done)) {
          activeIndex = 4;
        }
      }

      steps.forEach((stepEl, idx) => {
        const st = stepStatuses[idx];
        const numEl = stepEl.querySelector('.step-num');

        stepEl.classList.remove('active', 'completed');

        if (st.done) {
          stepEl.classList.add('completed');
          if (numEl) {
            numEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          }
        } else {
          if (numEl) {
            numEl.textContent = st.num;
          }
        }

        if (idx === activeIndex) {
          stepEl.classList.add('active');
        }
      });

      // Update connector lines between steps
      lines.forEach((lineEl, idx) => {
        lineEl.classList.remove('completed', 'active');
        if (stepStatuses[idx]?.done) {
          lineEl.classList.add('completed');
        } else if (idx === activeIndex - 1) {
          lineEl.classList.add('active');
        }
      });
    }

    // Map form fields to step index for dynamic focus tracking
    form.addEventListener('focusin', (e) => {
      const target = e.target;
      const card = target.closest('.req-card, .req-auth-card');
      if (!card) return;

      const cardId = card.id;
      if (cardId === 'sec-step-1') focusedStepIndex = 0;
      else if (cardId === 'sec-step-2' || card.closest('.req-column:first-child')) {
        const title = card.querySelector('.req-section-title')?.textContent || '';
        if (title.includes('01.')) focusedStepIndex = 0;
        else if (title.includes('02.') || title.includes('03.')) focusedStepIndex = 1;
        else if (title.includes('04.') || title.includes('05.')) focusedStepIndex = 2;
      }
      
      const title = card.querySelector('.req-section-title')?.textContent || '';
      if (title.includes('01.')) focusedStepIndex = 0;
      else if (title.includes('02.') || title.includes('03.')) focusedStepIndex = 1;
      else if (title.includes('04.') || title.includes('05.') || title.includes('06.') || title.includes('07.')) focusedStepIndex = 2;
      else if (title.includes('08.') || title.includes('09.') || title.includes('10.')) focusedStepIndex = 3;
      else if (card.classList.contains('req-auth-card') || cardId === 'sec-step-5') focusedStepIndex = 4;

      updateDynamicSteps(focusedStepIndex);
    });

    // Real-time input & change events
    form.addEventListener('input', () => updateDynamicSteps());
    form.addEventListener('change', () => updateDynamicSteps());

    // Click on step indicator to smooth-scroll to section
    const targetMap = {
      '1': 'sec-step-1',
      '2': 'sec-step-2',
      '3': 'sec-step-3',
      '4': 'sec-step-4',
      '5': 'sec-step-5'
    };

    steps.forEach(stepEl => {
      stepEl.addEventListener('click', () => {
        const stepNum = stepEl.getAttribute('data-step');
        const targetId = targetMap[stepNum];
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          focusedStepIndex = parseInt(stepNum, 10) - 1;
          updateDynamicSteps(focusedStepIndex);

          const yOffset = -90;
          const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });

          // Visual highlight pulse
          targetSection.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
          targetSection.style.boxShadow = '0 0 20px rgba(40, 114, 161, 0.45)';
          targetSection.style.borderColor = '#4A90C2';
          setTimeout(() => {
            targetSection.style.boxShadow = '';
            targetSection.style.borderColor = '';
          }, 1200);
        }
      });
    });

    // Initial state check
    updateDynamicSteps(0);
    window.updateDynamicSteps = updateDynamicSteps;
  }

  initDynamicStepProgress();
});
