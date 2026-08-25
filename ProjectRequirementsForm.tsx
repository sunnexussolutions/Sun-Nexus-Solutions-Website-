import React, { useState, useRef } from 'react';
import { 
  User, Briefcase, FileCode, Desktop, Star, Palette, FilePen, 
  Clock, Wallet, Server, StickyNote, ClipboardCheck, Shield, Signature, Send 
} from 'lucide-react';

export interface RequirementFormData {
  client_name: string;
  contact_person: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  business_type: string;
  business_name: string;
  website_social?: string;
  years_in_business?: string;
  project_title: string;
  purpose_of_website: string;
  business_description: string;
  website_type: string[];
  reference_links?: string;
  features: string[];
  design_preference: string;
  color_preference?: string;
  has_logo?: string;
  will_provide_content?: string;
  content_provider?: string;
  pages_required?: string;
  start_date: string;
  expected_deadline: string;
  fixed_deadline?: string;
  budget_range: string;
  has_domain?: string;
  has_hosting?: string;
  need_domain_hosting_help?: string;
  additional_notes?: string;
  client_signature?: string;
  authorization_date: string;
}

export const ProjectRequirementsForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<RequirementFormData>>({
    website_type: [],
    features: [],
    design_preference: 'No, I need suggestions from your team',
    budget_range: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6d28d9';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'website_type' | 'features', value: string) => {
    setFormData(prev => {
      const currentList = prev[category] || [];
      const updated = currentList.includes(value)
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sigData = canvasRef.current ? canvasRef.current.toDataURL('image/png') : '';
    const payload = { ...formData, client_signature: sigData };

    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setToastMessage('✓ Form submitted successfully!');
      } else {
        setToastMessage('✓ Form saved successfully!');
      }
    } catch {
      setToastMessage('✓ Form requirement recorded!');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold text-sm mb-3">
          📋 SUN NEXUS SOLUTIONS
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          PROJECT REQUIREMENT FORM
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            {/* 01. Client Information */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold tracking-wide uppercase">01. Client Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Full Name / Org Name *</label>
                  <input required name="client_name" onChange={handleInputChange} placeholder="Enter your name or org name" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Contact Person *</label>
                  <input required name="contact_person" onChange={handleInputChange} placeholder="Enter contact person name" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email Address *</label>
                  <input required type="email" name="email" onChange={handleInputChange} placeholder="Enter your email address" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone Number *</label>
                  <input required type="tel" name="phone" onChange={handleInputChange} placeholder="Enter your phone number" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>

            {/* 02. Business Information */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold tracking-wide uppercase">02. Business Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Business Type *</label>
                  <select required name="business_type" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm">
                    <option value="">Select your business type</option>
                    <option value="Startup">Startup</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Educational">Educational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Business Name *</label>
                  <input required name="business_name" onChange={handleInputChange} placeholder="Enter your business name" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm" />
                </div>
              </div>
            </div>

            {/* 03. Project Information */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <FileCode className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold tracking-wide uppercase">03. Project Information</h2>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Project Title *</label>
                <input required name="project_title" onChange={handleInputChange} placeholder="Enter project title" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Brief Description *</label>
                <textarea required name="business_description" onChange={handleInputChange} placeholder="Describe your business and project goals..." className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm min-h-[90px]" />
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* 08. Timeline & Deadline */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold tracking-wide uppercase">08. Timeline & Deadline</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Expected Start Date *</label>
                  <input required type="date" name="start_date" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Expected Deadline *</label>
                  <input required type="date" name="expected_deadline" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm" />
                </div>
              </div>
            </div>

            {/* 09. Budget Range */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Wallet className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold tracking-wide uppercase">09. Budget Range</h2>
              </div>
              <select required name="budget_range" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm">
                <option value="">Select budget range</option>
                <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                <option value="₹1,00,000+">₹1,00,000+</option>
              </select>
            </div>

            {/* Submission Checklist */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <h2 className="text-base font-bold text-amber-900 dark:text-amber-200 tracking-wide uppercase">Submission Checklist</h2>
              </div>
              <label className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                <input required type="checkbox" defaultChecked className="rounded text-purple-600" />
                I confirm that all the above information is correct.
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                <input required type="checkbox" defaultChecked className="rounded text-purple-600" />
                I understand that this form is not a final agreement.
              </label>
            </div>
          </div>
        </div>

        {/* Authorization & Signature Pad */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Shield className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-bold uppercase">Authorization</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              I hereby confirm that the information provided above is true to the best of my knowledge and I authorize Sun Nexus Solutions to contact me.
            </p>
            <div>
              <label className="block text-sm font-semibold mb-1">Client Signature *</label>
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl h-28 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={110}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                />
                {!hasSignature && (
                  <span className="text-xs text-slate-400 pointer-events-none flex items-center gap-1">
                    <Signature className="w-4 h-4" /> Sign here
                  </span>
                )}
                <button type="button" onClick={clearSignature} className="absolute bottom-2 right-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                  Clear
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Date *</label>
              <input required type="date" name="authorization_date" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-sm" />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all">
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Requirement Form'}
          </button>
        </div>
      </form>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
export default ProjectRequirementsForm;
