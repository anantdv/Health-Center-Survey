import React, { useState, useEffect } from 'react';
import './SurveyCapture.css';

const INITIAL_FORM_STATE = {
  facilityName: '',
  location: '',
  section1: {
    totalBeds: '',
    occupancyRate: '',
    emergencyAdmissions: '',
    opdToIpdAdmissions: '',
    genWardStay: '',
    icuStay: ''
  },
  section2: {
    generalMedicine: '',
    surgery: '',
    obgyn: '',
    pediatrics: '',
    icuCritical: '',
    emergencyTrauma: '',
    infectiousDiseases: ''
  },
  section3: {
    continuousMon: '',
    intermittentMon: '',
    minimalMon: '',
    parameters: [],
    parametersOther: '',
    highAcuityFreq: '',
    mediumAcuityFreq: '',
    lowAcuityFreq: ''
  },
  section4: {
    doctorVisits: '',
    nurseVisits: '',
    bedsideActivities: [],
    avgVisitTime: ''
  },
  section5: {
    emergenciesPerDay: '',
    emergencyTypes: [],
    emergencyTypesOther: '',
    avgResponseTime: '',
    emergencyEquipment: []
  },
  section6: {
    dispensingModel: [],
    supplyFrequency: [],
    dispensingDoneBy: [],
    storageMethod: [],
    issuesFaced: []
  },
  section7: {
    drugCategories: [],
    highAcuityAdminFreq: '',
    genWardAdminFreq: ''
  },
  section8: {
    trackingMethod: [],
    verificationRightPatient: '',
    verificationRightDrug: '',
    verificationRightDose: '',
    verificationRightTime: '',
    commonErrors: [],
    alertsAvailable: [],
    requiredImprovements: []
  },
  section9: {
    inventoryFlow: [],
    inventoryFlowOther: '',
    emergencyTime: '',
    routineTime: '',
    inventorySystem: [],
    stockVisibility: [],
    stockOutFrequency: [],
    expiryManagement: [],
    reverseFlow: [],
    keyPainPoints: []
  },
  section10: {
    diagnostics: [],
    turnaroundIssues: ''
  },
  section11: {
    currentSystem: [],
    requiredBedside: [],
    issues: []
  },
  section12: {
    wardNurseRatio: '',
    icuNurseRatio: '',
    nonClinicalTime: '',
    challenges: []
  },
  section13: {
    power: [],
    network: [],
    spaceNearBed: []
  },
  section14: {
    unavailableDevices: '',
    sharingRatio: '',
    maintenanceIssues: []
  },
  section15: {
    requiredCartFeatures: [],
    prioritySpeed: '',
    priorityAccuracy: '',
    priorityMobility: '',
    priorityCost: '',
    priorityEaseOfUse: ''
  },
  section16: {
    slowsBedsideCare: '',
    medicineHandlingChallenge: '',
    maxImpactImprovement: '',
    idealCartInclude: ''
  }
};

export default function SurveyCapture({ onSubmit }) {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('survey_draft');
    return saved ? JSON.parse(saved) : INITIAL_FORM_STATE;
  });

  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('survey_images_draft');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeSection, setActiveSection] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('survey_draft', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('survey_images_draft', JSON.stringify(images));
  }, [images]);

  // Compute validation and progress
  const getSectionStatus = (sectionNum) => {
    if (sectionNum === 0) {
      return formData.facilityName && formData.location ? 'complete' : 'empty';
    }

    const data = formData[`section${sectionNum}`];
    if (!data) return 'empty';

    // Simple heuristic check for completion
    const values = Object.values(data);
    const filledCount = values.filter(v => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== '' && v !== null && v !== undefined;
    }).length;

    if (filledCount === 0) return 'empty';
    if (filledCount === values.length) return 'complete';
    return 'partial';
  };

  // Calculate overall progress percentage
  useEffect(() => {
    let totalSections = 17; // General Info + 16 sections
    let completedCount = 0;

    if (formData.facilityName && formData.location) completedCount += 1;

    for (let i = 1; i <= 16; i++) {
      const status = getSectionStatus(i);
      if (status === 'complete') completedCount += 1;
      else if (status === 'partial') completedCount += 0.5;
    }

    setFormProgress(Math.round((completedCount / totalSections) * 100));
  }, [formData]);

  // Section 2 Sum Check
  const getSection2Sum = () => {
    const s2 = formData.section2;
    return (
      (Number(s2.generalMedicine) || 0) +
      (Number(s2.surgery) || 0) +
      (Number(s2.obgyn) || 0) +
      (Number(s2.pediatrics) || 0) +
      (Number(s2.icuCritical) || 0) +
      (Number(s2.emergencyTrauma) || 0) +
      (Number(s2.infectiousDiseases) || 0)
    );
  };

  // Section 3 Sum Check
  const getSection3Sum = () => {
    const s3 = formData.section3;
    return (
      (Number(s3.continuousMon) || 0) +
      (Number(s3.intermittentMon) || 0) +
      (Number(s3.minimalMon) || 0)
    );
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section, field, option, checked) => {
    const currentList = formData[section][field] || [];
    let updatedList;
    if (checked) {
      updatedList = [...currentList, option];
    } else {
      updatedList = currentList.filter(item => item !== option);
    }
    handleInputChange(section, field, updatedList);
  };

  // Handle image upload and base64 parsing
  const handleImageChange = (sectionIndex, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          const sectionImages = prev[sectionIndex] || [];
          return {
            ...prev,
            [sectionIndex]: [...sectionImages, reader.result]
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (sectionIndex, imgIdx) => {
    setImages(prev => {
      const updatedList = [...(prev[sectionIndex] || [])];
      updatedList.splice(imgIdx, 1);
      return {
        ...prev,
        [sectionIndex]: updatedList
      };
    });
  };

  const clearDraft = () => {
    if (window.confirm("Are you sure you want to discard your draft and start fresh?")) {
      setFormData(INITIAL_FORM_STATE);
      setImages({});
      localStorage.removeItem('survey_draft');
      localStorage.removeItem('survey_images_draft');
      setActiveSection(1);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.facilityName || !formData.location) {
      alert("Please enter a Facility Name and Location under general overview before submitting.");
      setActiveSection(1);
      return;
    }

    const s2Sum = getSection2Sum();
    if (s2Sum > 0 && s2Sum !== 100) {
      alert(`Section 2 Category Mix sum must equal 100%. Currently it is ${s2Sum}%.`);
      setActiveSection(2);
      return;
    }

    const s3Sum = getSection3Sum();
    if (s3Sum > 0 && s3Sum !== 100) {
      alert(`Section 3 Patient monitoring requirement percentages must equal 100%. Currently it is ${s3Sum}%.`);
      setActiveSection(3);
      return;
    }

    onSubmit({
      ...formData,
      images,
      timestamp: new Date().toISOString()
    });

    // Reset draft
    setFormData(INITIAL_FORM_STATE);
    setImages({});
    localStorage.removeItem('survey_draft');
    localStorage.removeItem('survey_images_draft');
    alert("Survey Submitted Successfully!");
  };

  const toggleSection = (sectionIndex) => {
    setActiveSection(activeSection === sectionIndex ? null : sectionIndex);
  };

  return (
    <div className="capture-container fade-in">
      <div className="progress-header glass-panel">
        <div className="progress-info">
          <div>
            <h2>Capture Audit</h2>
            <p>Complete all 16 sections below</p>
          </div>
          <span className="progress-percent">{formProgress}% Done</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${formProgress}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="capture-form-content">
        
        {/* GENERAL METADATA SECTION */}
        <div className={`form-accordion-item ${activeSection === 1 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(1)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(0)}`}></span>
              <h3>Facility Info & Overview</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <div className="input-group">
              <label>Facility Name <span className="req">*</span></label>
              <input 
                type="text" 
                value={formData.facilityName} 
                onChange={(e) => setFormData(prev => ({ ...prev, facilityName: e.target.value }))}
                placeholder="e.g. City Hospital Center"
                required
              />
            </div>
            <div className="input-group mt-2">
              <label>Location / Area <span className="req">*</span></label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Ward 4, Block B"
                required
              />
            </div>

            <div className="sub-section-title mt-4">Section 1: Hospital Overview</div>
            <div className="grid-2">
              <div className="input-group">
                <label>Total Bed Strength</label>
                <input 
                  type="number" 
                  value={formData.section1.totalBeds} 
                  onChange={(e) => handleInputChange('section1', 'totalBeds', e.target.value)}
                  placeholder="e.g. 250"
                />
              </div>
              <div className="input-group">
                <label>Avg Occupancy Rate (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.section1.occupancyRate} 
                  onChange={(e) => handleInputChange('section1', 'occupancyRate', e.target.value)}
                  placeholder="e.g. 75"
                />
              </div>
            </div>

            <label className="input-title-label mt-2">Average Daily Admissions</label>
            <div className="grid-2">
              <div className="input-group">
                <label>Emergency</label>
                <input 
                  type="number" 
                  value={formData.section1.emergencyAdmissions} 
                  onChange={(e) => handleInputChange('section1', 'emergencyAdmissions', e.target.value)}
                  placeholder="e.g. 20"
                />
              </div>
              <div className="input-group">
                <label>OPD to IPD</label>
                <input 
                  type="number" 
                  value={formData.section1.opdToIpdAdmissions} 
                  onChange={(e) => handleInputChange('section1', 'opdToIpdAdmissions', e.target.value)}
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <label className="input-title-label mt-2">Average Length of Stay (Days)</label>
            <div className="grid-2">
              <div className="input-group">
                <label>General Ward</label>
                <input 
                  type="number" 
                  value={formData.section1.genWardStay} 
                  onChange={(e) => handleInputChange('section1', 'genWardStay', e.target.value)}
                  placeholder="Days"
                />
              </div>
              <div className="input-group">
                <label>ICU</label>
                <input 
                  type="number" 
                  value={formData.section1.icuStay} 
                  onChange={(e) => handleInputChange('section1', 'icuStay', e.target.value)}
                  placeholder="Days"
                />
              </div>
            </div>

            {/* Media Upload Subcomponent */}
            <MediaUpload sectionIndex={1} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 2 */}
        <div className={`form-accordion-item ${activeSection === 2 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(2)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(2)}`}></span>
              <h3>Sec 2: Patient Category Mix</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">Enter approximate distribution percentage (Sum must equal 100%)</p>
            
            <div className={`sum-badge ${getSection2Sum() === 100 ? 'valid' : 'invalid'}`}>
              Sum: {getSection2Sum()}% (Must be 100%)
            </div>

            <div className="input-group-row">
              <label>General Medicine (%)</label>
              <input type="number" min="0" max="100" value={formData.section2.generalMedicine} onChange={(e) => handleInputChange('section2', 'generalMedicine', e.target.value)} placeholder="0" />
            </div>
            <div className="input-group-row mt-2">
              <label>Surgery (%)</label>
              <input type="number" min="0" max="100" value={formData.section2.surgery} onChange={(e) => handleInputChange('section2', 'surgery', e.target.value)} placeholder="0" />
            </div>
            <div className="input-group-row mt-2">
              <label>Obstetrics & Gynecology (%)</label>
              <input type="number" min="0" max="100" value={formData.section2.obgyn} onChange={(e) => handleInputChange('section2', 'obgyn', e.target.value)} placeholder="0" />
            </div>
            <div className="input-group-row mt-2">
              <label>Pediatrics (%)</label>
              <input type="number" min="0" max="100" value={formData.section2.pediatrics} onChange={(e) => handleInputChange('section2', 'pediatrics', e.target.value)} placeholder="0" />
            </div>
            <div className="input-group-row mt-2">
              <label>ICU / Critical Care (%)</label>
              <input type="number" min="0" max="100" value={formData.section2.icuCritical} onChange={(e) => handleInputChange('section2', 'icuCritical', e.target.value)} placeholder="0" />
            </div>
            <div className="input-group-row mt-2">
              <label>Emergency / Trauma (%)</label>
              <input type="number" min="0" max="100" value={formData.section2.emergencyTrauma} onChange={(e) => handleInputChange('section2', 'emergencyTrauma', e.target.value)} placeholder="0" />
            </div>
            <div className="input-group-row mt-2">
              <label>Infectious Diseases (%)</label>
              <input type="number" min="0" max="100" value={formData.section2.infectiousDiseases} onChange={(e) => handleInputChange('section2', 'infectiousDiseases', e.target.value)} placeholder="0" />
            </div>

            <MediaUpload sectionIndex={2} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 3 */}
        <div className={`form-accordion-item ${activeSection === 3 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(3)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(3)}`}></span>
              <h3>Sec 3: Patient Acuity & Monitoring</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Patient monitoring requirement (Sum must equal 100%)</p>
            <div className={`sum-badge ${getSection3Sum() === 100 ? 'valid' : 'invalid'}`}>
              Sum: {getSection3Sum()}% (Must be 100%)
            </div>

            <div className="grid-3">
              <div className="input-group">
                <label>Continuous</label>
                <input type="number" value={formData.section3.continuousMon} onChange={(e) => handleInputChange('section3', 'continuousMon', e.target.value)} placeholder="%" />
              </div>
              <div className="input-group">
                <label>Intermittent</label>
                <input type="number" value={formData.section3.intermittentMon} onChange={(e) => handleInputChange('section3', 'intermittentMon', e.target.value)} placeholder="%" />
              </div>
              <div className="input-group">
                <label>Minimal</label>
                <input type="number" value={formData.section3.minimalMon} onChange={(e) => handleInputChange('section3', 'minimalMon', e.target.value)} placeholder="%" />
              </div>
            </div>

            <p className="section-desc mt-4">2. Common parameters monitored</p>
            <div className="checkbox-grid">
              {['BP', 'SpO₂', 'ECG', 'Temperature', 'Respiratory rate', 'Blood glucose'].map(param => (
                <label key={param} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section3.parameters.includes(param)}
                    onChange={(e) => handleCheckboxChange('section3', 'parameters', param, e.target.checked)}
                  />
                  <span>{param}</span>
                </label>
              ))}
            </div>
            <div className="input-group mt-2">
              <label>Others (Please specify)</label>
              <input type="text" value={formData.section3.parametersOther} onChange={(e) => handleInputChange('section3', 'parametersOther', e.target.value)} placeholder="e.g. CO2, arterial pressure" />
            </div>

            <p className="section-desc mt-4">3. Frequency of monitoring (hours)</p>
            <div className="grid-3">
              <div className="input-group">
                <label>High acuity</label>
                <input type="number" value={formData.section3.highAcuityFreq} onChange={(e) => handleInputChange('section3', 'highAcuityFreq', e.target.value)} placeholder="Hrs" />
              </div>
              <div className="input-group">
                <label>Medium</label>
                <input type="number" value={formData.section3.mediumAcuityFreq} onChange={(e) => handleInputChange('section3', 'mediumAcuityFreq', e.target.value)} placeholder="Hrs" />
              </div>
              <div className="input-group">
                <label>Low</label>
                <input type="number" value={formData.section3.lowAcuityFreq} onChange={(e) => handleInputChange('section3', 'lowAcuityFreq', e.target.value)} placeholder="Hrs" />
              </div>
            </div>

            <MediaUpload sectionIndex={3} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 4 */}
        <div className={`form-accordion-item ${activeSection === 4 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(4)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(4)}`}></span>
              <h3>Sec 4: Bedside Care Workflow</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Average bedside visits per patient/day</p>
            <div className="grid-2">
              <div className="input-group">
                <label>Doctor Visits</label>
                <input type="number" value={formData.section4.doctorVisits} onChange={(e) => handleInputChange('section4', 'doctorVisits', e.target.value)} placeholder="Visits/day" />
              </div>
              <div className="input-group">
                <label>Nurse Visits</label>
                <input type="number" value={formData.section4.nurseVisits} onChange={(e) => handleInputChange('section4', 'nurseVisits', e.target.value)} placeholder="Visits/day" />
              </div>
            </div>

            <p className="section-desc mt-4">2. Activities performed at bedside</p>
            <div className="checkbox-grid">
              {['Vital monitoring', 'Drug administration', 'IV fluid management', 'Sample collection', 'Wound dressing', 'Documentation', 'Emergency intervention'].map(act => (
                <label key={act} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section4.bedsideActivities.includes(act)}
                    onChange={(e) => handleCheckboxChange('section4', 'bedsideActivities', act, e.target.checked)}
                  />
                  <span>{act}</span>
                </label>
              ))}
            </div>

            <div className="input-group mt-4">
              <label>3. Average time per visit (Minutes)</label>
              <input type="number" value={formData.section4.avgVisitTime} onChange={(e) => handleInputChange('section4', 'avgVisitTime', e.target.value)} placeholder="Mins" />
            </div>

            <MediaUpload sectionIndex={4} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 5 */}
        <div className={`form-accordion-item ${activeSection === 5 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(5)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(5)}`}></span>
              <h3>Sec 5: Emergency & Rapid Response</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <div className="input-group">
              <label>1. Number of bedside emergencies per day</label>
              <input type="number" value={formData.section5.emergenciesPerDay} onChange={(e) => handleInputChange('section5', 'emergenciesPerDay', e.target.value)} placeholder="e.g. 2" />
            </div>

            <p className="section-desc mt-4">2. Common types</p>
            <div className="checkbox-grid">
              {['Cardiac arrest', 'Respiratory distress', 'Sepsis', 'Trauma'].map(type => (
                <label key={type} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section5.emergencyTypes.includes(type)}
                    onChange={(e) => handleCheckboxChange('section5', 'emergencyTypes', type, e.target.checked)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            <div className="input-group mt-2">
              <label>Others (Please specify)</label>
              <input type="text" value={formData.section5.emergencyTypesOther} onChange={(e) => handleInputChange('section5', 'emergencyTypesOther', e.target.value)} placeholder="e.g. anaphylaxis" />
            </div>

            <div className="input-group mt-4">
              <label>3. Average response time (Minutes)</label>
              <input type="number" value={formData.section5.avgResponseTime} onChange={(e) => handleInputChange('section5', 'avgResponseTime', e.target.value)} placeholder="Mins" />
            </div>

            <p className="section-desc mt-4">4. Equipment required urgently</p>
            <div className="checkbox-grid">
              {['Defibrillator', 'Oxygen', 'Suction', 'Emergency drugs'].map(equip => (
                <label key={equip} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section5.emergencyEquipment.includes(equip)}
                    onChange={(e) => handleCheckboxChange('section5', 'emergencyEquipment', equip, e.target.checked)}
                  />
                  <span>{equip}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={5} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 6 */}
        <div className={`form-accordion-item ${activeSection === 6 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(6)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(6)}`}></span>
              <h3>Sec 6: Medicine Dispensing</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Current dispensing model</p>
            <div className="checkbox-grid">
              {['Central pharmacy → ward stock', 'Patient-specific dispensing', 'Nurse-managed stock', 'Mixed'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section6.dispensingModel.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section6', 'dispensingModel', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">2. Supply frequency</p>
            <div className="checkbox-grid">
              {['Once daily', 'Twice daily', 'On-demand'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section6.supplyFrequency.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section6', 'supplyFrequency', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">3. Bedside dispensing done by</p>
            <div className="checkbox-grid">
              {['Nurse', 'Pharmacist', 'Doctor'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section6.dispensingDoneBy.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section6', 'dispensingDoneBy', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">4. Storage method</p>
            <div className="checkbox-grid">
              {['Open trays', 'Locked cabinets', 'Patient bins'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section6.storageMethod.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section6', 'storageMethod', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">5. Issues faced</p>
            <div className="checkbox-grid text-danger-inputs">
              {['Delay', 'Missing drugs', 'Wrong drug selection', 'Expiry issues', 'Theft/pilferage'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section6.issuesFaced.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section6', 'issuesFaced', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={6} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 7 */}
        <div className={`form-accordion-item ${activeSection === 7 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(7)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(7)}`}></span>
              <h3>Sec 7: Medication Usage Intensity</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Common drug categories</p>
            <div className="checkbox-grid">
              {['Antibiotics', 'Analgesics', 'IV fluids', 'Cardiac drugs', 'Sedatives'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section7.drugCategories.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section7', 'drugCategories', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">2. Administration frequency (Times/day)</p>
            <div className="grid-2">
              <div className="input-group">
                <label>High acuity ward</label>
                <input type="number" value={formData.section7.highAcuityAdminFreq} onChange={(e) => handleInputChange('section7', 'highAcuityAdminFreq', e.target.value)} placeholder="Times/day" />
              </div>
              <div className="input-group">
                <label>General ward</label>
                <input type="number" value={formData.section7.genWardAdminFreq} onChange={(e) => handleInputChange('section7', 'genWardAdminFreq', e.target.value)} placeholder="Times/day" />
              </div>
            </div>

            <MediaUpload sectionIndex={7} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 8 */}
        <div className={`form-accordion-item ${activeSection === 8 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(8)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(8)}`}></span>
              <h3>Sec 8: Dosage Monitoring & Safety</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Current tracking method</p>
            <div className="checkbox-grid">
              {['Paper MAR', 'Digital system', 'Manual/verbal'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section8.trackingMethod.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section8', 'trackingMethod', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">2. Verification system exists for:</p>
            <div className="grid-2">
              <div className="input-group">
                <label>Right patient</label>
                <select value={formData.section8.verificationRightPatient} onChange={(e) => handleInputChange('section8', 'verificationRightPatient', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="input-group">
                <label>Right drug</label>
                <select value={formData.section8.verificationRightDrug} onChange={(e) => handleInputChange('section8', 'verificationRightDrug', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="input-group mt-2">
                <label>Right dose</label>
                <select value={formData.section8.verificationRightDose} onChange={(e) => handleInputChange('section8', 'verificationRightDose', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="input-group mt-2">
                <label>Right time</label>
                <select value={formData.section8.verificationRightTime} onChange={(e) => handleInputChange('section8', 'verificationRightTime', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <p className="section-desc mt-4">3. Common errors</p>
            <div className="checkbox-grid text-danger-inputs">
              {['Missed dose', 'Wrong dose', 'Wrong patient', 'Delay'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section8.commonErrors.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section8', 'commonErrors', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">4. Alerts available</p>
            <div className="checkbox-grid">
              {['None', 'Manual', 'Digital'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section8.alertsAvailable.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section8', 'alertsAvailable', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">5. Required improvements</p>
            <div className="checkbox-grid">
              {['Barcode/RFID', 'Automated alerts', 'Dose calculation', 'Interaction alerts'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section8.requiredImprovements.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section8', 'requiredImprovements', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={8} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 9 */}
        <div className={`form-accordion-item ${activeSection === 9 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(9)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(9)}`}></span>
              <h3>Sec 9: Medicine Inventory Flow</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Flow type</p>
            <div className="checkbox-grid">
              {['Doctor → Nurse → Administer', 'Digital → Pharmacy → Ward'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section9.inventoryFlow.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section9', 'inventoryFlow', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <div className="input-group mt-2">
              <label>Others (Please specify)</label>
              <input type="text" value={formData.section9.inventoryFlowOther} onChange={(e) => handleInputChange('section9', 'inventoryFlowOther', e.target.value)} placeholder="e.g. prescription slip delivery" />
            </div>

            <p className="section-desc mt-4">2. Time from prescription to administration (Minutes)</p>
            <div className="grid-2">
              <div className="input-group">
                <label>Emergency</label>
                <input type="number" value={formData.section9.emergencyTime} onChange={(e) => handleInputChange('section9', 'emergencyTime', e.target.value)} placeholder="Mins" />
              </div>
              <div className="input-group">
                <label>Routine</label>
                <input type="number" value={formData.section9.routineTime} onChange={(e) => handleInputChange('section9', 'routineTime', e.target.value)} placeholder="Mins" />
              </div>
            </div>

            <p className="section-desc mt-4">3. Inventory system</p>
            <div className="checkbox-grid">
              {['Manual', 'Excel', 'ERP', 'None'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section9.inventorySystem.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section9', 'inventorySystem', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">4. Stock visibility</p>
            <div className="checkbox-grid">
              {['Real-time', 'Partial', 'None'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section9.stockVisibility.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section9', 'stockVisibility', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">5. Stock-out frequency</p>
            <div className="checkbox-grid text-danger-inputs">
              {['Daily', 'Weekly', 'Rare'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section9.stockOutFrequency.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section9', 'stockOutFrequency', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">6. Expiry management</p>
            <div className="checkbox-grid">
              {['Regular', 'Occasional', 'None'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section9.expiryManagement.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section9', 'expiryManagement', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">7. Reverse flow</p>
            <div className="checkbox-grid">
              {['Return', 'Reuse', 'Discard'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section9.reverseFlow.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section9', 'reverseFlow', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4 text-danger">8. Key pain points</p>
            <div className="checkbox-grid text-danger-inputs">
              {['Delay', 'No tracking', 'Wastage', 'Billing mismatch'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section9.keyPainPoints.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section9', 'keyPainPoints', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={9} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 10 */}
        <div className={`form-accordion-item ${activeSection === 10 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(10)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(10)}`}></span>
              <h3>Sec 10: Diagnostics at Bedside</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <div className="checkbox-grid">
              {['Glucometer', 'ECG', 'Ultrasound', 'Hemoglobin testing', 'Urine tests'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section10.diagnostics.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section10', 'diagnostics', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <div className="input-group mt-4">
              <label>Turnaround issues faced?</label>
              <select value={formData.section10.turnaroundIssues} onChange={(e) => handleInputChange('section10', 'turnaroundIssues', e.target.value)}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <MediaUpload sectionIndex={10} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 11 */}
        <div className={`form-accordion-item ${activeSection === 11 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(11)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(11)}`}></span>
              <h3>Sec 11: Documentation & IT</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Current system status</p>
            <div className="checkbox-grid">
              {['Paper', 'Hybrid', 'Digital'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section11.currentSystem.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section11', 'currentSystem', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">2. Systems/tools required at bedside</p>
            <div className="checkbox-grid">
              {['EMR access', 'Order entry', 'Drug reference'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section11.requiredBedside.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section11', 'requiredBedside', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">3. System workflow issues faced</p>
            <div className="checkbox-grid text-danger-inputs">
              {['Rework', 'Missing data', 'Delays'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section11.issues.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section11', 'issues', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={11} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 12 */}
        <div className={`form-accordion-item ${activeSection === 12 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(12)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(12)}`}></span>
              <h3>Sec 12: Nursing Workflow</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Nurse-to-patient ratio</p>
            <div className="grid-2">
              <div className="input-group">
                <label>Ward Ratio (e.g. 1:6)</label>
                <input type="text" value={formData.section12.wardNurseRatio} onChange={(e) => handleInputChange('section12', 'wardNurseRatio', e.target.value)} placeholder="e.g. 1:6" />
              </div>
              <div className="input-group">
                <label>ICU Ratio (e.g. 1:2)</label>
                <input type="text" value={formData.section12.icuNurseRatio} onChange={(e) => handleInputChange('section12', 'icuNurseRatio', e.target.value)} placeholder="e.g. 1:2" />
              </div>
            </div>

            <div className="input-group mt-4">
              <label>2. Time spent on non-clinical work (%)</label>
              <input type="number" min="0" max="100" value={formData.section12.nonClinicalTime} onChange={(e) => handleInputChange('section12', 'nonClinicalTime', e.target.value)} placeholder="e.g. 30%" />
            </div>

            <p className="section-desc mt-4">3. Workflow challenges faced</p>
            <div className="checkbox-grid">
              {['Walking time', 'Searching equipment', 'Medication delays', 'Documentation load'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section12.challenges.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section12', 'challenges', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={12} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 13 */}
        <div className={`form-accordion-item ${activeSection === 13 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(13)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(13)}`}></span>
              <h3>Sec 13: Infrastructure</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Power reliability</p>
            <div className="checkbox-grid">
              {['Reliable', 'Intermittent'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section13.power.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section13', 'power', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">2. Network connectivity strength</p>
            <div className="checkbox-grid">
              {['Strong', 'Moderate', 'Poor'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section13.network.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section13', 'network', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">3. Space available near patients bedside</p>
            <div className="checkbox-grid">
              {['Limited', 'Moderate', 'Adequate'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section13.spaceNearBed.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section13', 'spaceNearBed', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={13} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 14 */}
        <div className={`form-accordion-item ${activeSection === 14 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(14)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(14)}`}></span>
              <h3>Sec 14: Equipment Gaps</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <div className="input-group">
              <label>1. Frequently unavailable devices</label>
              <input type="text" value={formData.section14.unavailableDevices} onChange={(e) => handleInputChange('section14', 'unavailableDevices', e.target.value)} placeholder="e.g. Infusion pumps, monitors" />
            </div>

            <div className="input-group mt-4">
              <label>2. Sharing ratio (e.g. 1 monitor per X beds)</label>
              <input type="number" value={formData.section14.sharingRatio} onChange={(e) => handleInputChange('section14', 'sharingRatio', e.target.value)} placeholder="Beds sharing 1 device" />
            </div>

            <p className="section-desc mt-4">3. Device maintenance issues</p>
            <div className="checkbox-grid">
              {['Frequent', 'Occasional', 'Rare'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section14.maintenanceIssues.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section14', 'maintenanceIssues', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <MediaUpload sectionIndex={14} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 15 */}
        <div className={`form-accordion-item ${activeSection === 15 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(15)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(15)}`}></span>
              <h3>Sec 15: Ideal Bedside Cart Expectations</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <p className="section-desc">1. Required features</p>
            <div className="checkbox-grid">
              {['Monitor', 'Medicine storage', 'Computer/EMR', 'Battery backup', 'Mobility'].map(opt => (
                <label key={opt} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={formData.section15.requiredCartFeatures.includes(opt)}
                    onChange={(e) => handleCheckboxChange('section15', 'requiredCartFeatures', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <p className="section-desc mt-4">2. Priority level (1-5 scale, 5 being highest)</p>
            <div className="grid-2">
              <div className="input-group">
                <label>Speed</label>
                <input type="number" min="1" max="5" value={formData.section15.prioritySpeed} onChange={(e) => handleInputChange('section15', 'prioritySpeed', e.target.value)} placeholder="1-5" />
              </div>
              <div className="input-group">
                <label>Accuracy</label>
                <input type="number" min="1" max="5" value={formData.section15.priorityAccuracy} onChange={(e) => handleInputChange('section15', 'priorityAccuracy', e.target.value)} placeholder="1-5" />
              </div>
              <div className="input-group mt-2">
                <label>Mobility</label>
                <input type="number" min="1" max="5" value={formData.section15.priorityMobility} onChange={(e) => handleInputChange('section15', 'priorityMobility', e.target.value)} placeholder="1-5" />
              </div>
              <div className="input-group mt-2">
                <label>Cost</label>
                <input type="number" min="1" max="5" value={formData.section15.priorityCost} onChange={(e) => handleInputChange('section15', 'priorityCost', e.target.value)} placeholder="1-5" />
              </div>
              <div className="input-group mt-2">
                <label>Ease of Use</label>
                <input type="number" min="1" max="5" value={formData.section15.priorityEaseOfUse} onChange={(e) => handleInputChange('section15', 'priorityEaseOfUse', e.target.value)} placeholder="1-5" />
              </div>
            </div>

            <MediaUpload sectionIndex={15} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* SECTION 16 */}
        <div className={`form-accordion-item ${activeSection === 16 ? 'open' : ''}`}>
          <div className="accordion-header" onClick={() => toggleSection(16)}>
            <div className="header-label">
              <span className={`status-dot ${getSectionStatus(16)}`}></span>
              <h3>Sec 16: User Feedback (End Notes)</h3>
            </div>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div className="accordion-content">
            <div className="input-group">
              <label>1. What slows down bedside care the most?</label>
              <textarea rows="3" value={formData.section16.slowsBedsideCare} onChange={(e) => handleInputChange('section16', 'slowsBedsideCare', e.target.value)} placeholder="Provide details..."></textarea>
            </div>
            
            <div className="input-group mt-2">
              <label>2. What is the biggest challenge in medicine handling?</label>
              <textarea rows="3" value={formData.section16.medicineHandlingChallenge} onChange={(e) => handleInputChange('section16', 'medicineHandlingChallenge', e.target.value)} placeholder="Provide details..."></textarea>
            </div>

            <div className="input-group mt-2">
              <label>3. What one improvement would have maximum impact?</label>
              <textarea rows="3" value={formData.section16.maxImpactImprovement} onChange={(e) => handleInputChange('section16', 'maxImpactImprovement', e.target.value)} placeholder="Provide details..."></textarea>
            </div>

            <div className="input-group mt-2">
              <label>4. What should an ideal smart bedside cart include?</label>
              <textarea rows="3" value={formData.section16.idealCartInclude} onChange={(e) => handleInputChange('section16', 'idealCartInclude', e.target.value)} placeholder="Provide details..."></textarea>
            </div>

            <MediaUpload sectionIndex={16} images={images} onImageChange={handleImageChange} onRemove={removeImage} />
          </div>
        </div>

        {/* CONTROL ACTIONS FOR FORM */}
        <div className="form-action-buttons">
          <button type="button" className="btn-discard" onClick={clearDraft}>
            Discard & Clear Draft
          </button>
          
          <button type="submit" className="btn-submit">
            Submit Assessment
          </button>
        </div>

      </form>
    </div>
  );
}

// Reusable Sub-component for Multiple Image Capture
function MediaUpload({ sectionIndex, images, onImageChange, onRemove }) {
  const sectionImages = images[sectionIndex] || [];
  
  return (
    <div className="media-upload-wrapper mt-4">
      <label className="media-title">Attach Survey Media (Section {sectionIndex})</label>
      <div className="media-controls">
        <label className="upload-btn-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span>Add Photos</span>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={(e) => onImageChange(sectionIndex, e)} 
            className="file-input-hidden"
          />
        </label>
      </div>

      {sectionImages.length > 0 && (
        <div className="thumbnails-row mt-2">
          {sectionImages.map((base64, idx) => (
            <div key={idx} className="thumb-container">
              <img src={base64} alt={`Upload preview ${idx}`} />
              <button 
                type="button" 
                className="remove-thumb-btn" 
                onClick={() => onRemove(sectionIndex, idx)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
