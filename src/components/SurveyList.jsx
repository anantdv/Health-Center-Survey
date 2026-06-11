import React, { useState } from 'react';
import './SurveyList.css';

export default function SurveyList({ surveys, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const filteredSurveys = surveys.filter(survey => 
    survey.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const countTotalImages = (imagesObj) => {
    if (!imagesObj) return 0;
    return Object.values(imagesObj).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  };

  return (
    <div className="list-container fade-in">
      <header className="page-header">
        <div className="header-brand">
          <img src="/logo.jpeg" alt="Logo" className="header-logo" onError={(e) => e.target.style.display = 'none'} />
          <div>
            <h1>Dashboard</h1>
            <p>Completed Health Center Audits</p>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Log Out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      <div className="search-bar-wrapper">
        <div className="search-input-container">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by hospital name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="survey-list-content">
        {filteredSurveys.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="15" x2="15" y2="15" />
              <line x1="9" y1="11" x2="15" y2="11" />
            </svg>
            <h3>No Audits Found</h3>
            <p>Try searching for a different keyword or start a new assessment.</p>
          </div>
        ) : (
          filteredSurveys.map(survey => {
            const imgCount = countTotalImages(survey.images);
            return (
              <div 
                key={survey.id} 
                className="survey-card glass-panel"
                onClick={() => setSelectedSurvey(survey)}
              >
                <div className="card-top">
                  <span className="card-badge">Completed</span>
                  <span className="card-date">{formatDate(survey.timestamp)}</span>
                </div>
                
                <h3 className="card-title">{survey.facilityName}</h3>
                <p className="card-location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {survey.location}
                </p>

                <div className="card-stats">
                  <div className="stat-pill">
                    <span className="stat-label">Beds:</span>
                    <span className="stat-val">{survey.sections.section1?.totalBeds || 'N/A'}</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-label">Occupancy:</span>
                    <span className="stat-val">{survey.sections.section1?.occupancyRate || '0'}%</span>
                  </div>
                  {imgCount > 0 && (
                    <div className="stat-pill image-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span className="stat-val">{imgCount} Photos</span>
                    </div>
                  )}
                </div>

                <div className="card-category-peek">
                  <strong>Patient Mix Peek:</strong> General Medicine {survey.sections.section2?.generalMedicine || '0'}%, Pediatrics {survey.sections.section2?.pediatrics || '0'}%
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAILED VIEW MODAL */}
      {selectedSurvey && (
        <div className="detail-modal-overlay" onClick={() => setSelectedSurvey(null)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedSurvey.facilityName}</h2>
                <p>{selectedSurvey.location} • {formatDate(selectedSurvey.timestamp)}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedSurvey(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* Image Banner Section */}
              {countTotalImages(selectedSurvey.images) > 0 && (
                <div className="detail-section image-gallery-section">
                  <h4>Attached Audit Media</h4>
                  <div className="horizontal-gallery">
                    {Object.entries(selectedSurvey.images).map(([sectionIdx, list]) => 
                      list.map((imgUrl, i) => (
                        <div key={`${sectionIdx}-${i}`} className="gallery-img-wrapper">
                          <img src={imgUrl} alt={`Section ${sectionIdx} photo`} />
                          <span className="gallery-tag">Sec {sectionIdx}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Section 1 */}
              <div className="detail-section">
                <h4>Section 1: Hospital Overview</h4>
                <div className="grid-2">
                  <div><strong>Total Bed Strength:</strong> {selectedSurvey.sections.section1?.totalBeds || '-'}</div>
                  <div><strong>Occupancy Rate:</strong> {selectedSurvey.sections.section1?.occupancyRate || '0'}%</div>
                  <div><strong>Daily Emergencies:</strong> {selectedSurvey.sections.section1?.emergencyAdmissions || '-'}</div>
                  <div><strong>OPD to IPD Daily:</strong> {selectedSurvey.sections.section1?.opdToIpdAdmissions || '-'}</div>
                  <div><strong>Avg Stay General Ward:</strong> {selectedSurvey.sections.section1?.genWardStay || '-'} days</div>
                  <div><strong>Avg Stay ICU:</strong> {selectedSurvey.sections.section1?.icuStay || '-'} days</div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="detail-section">
                <h4>Section 2: Patient Category Mix</h4>
                <div className="grid-2">
                  <div><strong>General Medicine:</strong> {selectedSurvey.sections.section2?.generalMedicine || '0'}%</div>
                  <div><strong>Surgery:</strong> {selectedSurvey.sections.section2?.surgery || '0'}%</div>
                  <div><strong>Obstetrics & Gynecology:</strong> {selectedSurvey.sections.section2?.obgyn || '0'}%</div>
                  <div><strong>Pediatrics:</strong> {selectedSurvey.sections.section2?.pediatrics || '0'}%</div>
                  <div><strong>ICU/Critical Care:</strong> {selectedSurvey.sections.section2?.icuCritical || '0'}%</div>
                  <div><strong>Emergency/Trauma:</strong> {selectedSurvey.sections.section2?.emergencyTrauma || '0'}%</div>
                  <div><strong>Infectious Diseases:</strong> {selectedSurvey.sections.section2?.infectiousDiseases || '0'}%</div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="detail-section">
                <h4>Section 3: Patient Acuity & Monitoring</h4>
                <div><strong>Monitoring Needs:</strong> Continuous: {selectedSurvey.sections.section3?.continuousMon || '0'}% | Intermittent: {selectedSurvey.sections.section3?.intermittentMon || '0'}% | Minimal: {selectedSurvey.sections.section3?.minimalMon || '0'}%</div>
                <div className="mt-1"><strong>Parameters Monitored:</strong> {selectedSurvey.sections.section3?.parameters?.join(', ') || 'None'} {selectedSurvey.sections.section3?.parametersOther && `(${selectedSurvey.sections.section3.parametersOther})`}</div>
                <div className="mt-1"><strong>Frequency:</strong> High: {selectedSurvey.sections.section3?.highAcuityFreq || '-'}h | Medium: {selectedSurvey.sections.section3?.mediumAcuityFreq || '-'}h | Low: {selectedSurvey.sections.section3?.lowAcuityFreq || '-'}h</div>
              </div>

              {/* Section 4 */}
              <div className="detail-section">
                <h4>Section 4: Bedside Care Workflow</h4>
                <div><strong>Bedside Visits/Day:</strong> Doctor: {selectedSurvey.sections.section4?.doctorVisits || '-'} | Nurse: {selectedSurvey.sections.section4?.nurseVisits || '-'}</div>
                <div className="mt-1"><strong>Bedside Activities:</strong> {selectedSurvey.sections.section4?.bedsideActivities?.join(', ') || 'None'}</div>
                <div className="mt-1"><strong>Avg Visit Duration:</strong> {selectedSurvey.sections.section4?.avgVisitTime || '-'} minutes</div>
              </div>

              {/* Section 5 */}
              <div className="detail-section">
                <h4>Section 5: Emergency & Rapid Response</h4>
                <div><strong>Daily Bedside Emergencies:</strong> {selectedSurvey.sections.section5?.emergenciesPerDay || '-'}</div>
                <div className="mt-1"><strong>Common Types:</strong> {selectedSurvey.sections.section5?.emergencyTypes?.join(', ') || 'None'} {selectedSurvey.sections.section5?.emergencyTypesOther && `(${selectedSurvey.sections.section5.emergencyTypesOther})`}</div>
                <div className="mt-1"><strong>Avg Response Time:</strong> {selectedSurvey.sections.section5?.avgResponseTime || '-'} mins</div>
                <div className="mt-1"><strong>Equipment Needed:</strong> {selectedSurvey.sections.section5?.emergencyEquipment?.join(', ') || 'None'}</div>
              </div>

              {/* Section 6 */}
              <div className="detail-section">
                <h4>Section 6: Medicine Dispensing</h4>
                <div><strong>Dispensing Model:</strong> {selectedSurvey.sections.section6?.dispensingModel?.join(', ') || 'None'}</div>
                <div><strong>Supply Frequency:</strong> {selectedSurvey.sections.section6?.supplyFrequency?.join(', ') || 'None'}</div>
                <div><strong>Dispensing Done By:</strong> {selectedSurvey.sections.section6?.dispensingDoneBy?.join(', ') || 'None'}</div>
                <div><strong>Storage Method:</strong> {selectedSurvey.sections.section6?.storageMethod?.join(', ') || 'None'}</div>
                <div className="mt-1 text-danger"><strong>Issues:</strong> {selectedSurvey.sections.section6?.issuesFaced?.join(', ') || 'None'}</div>
              </div>

              {/* Section 7 */}
              <div className="detail-section">
                <h4>Section 7: Medication Usage Intensity</h4>
                <div><strong>Common Categories:</strong> {selectedSurvey.sections.section7?.drugCategories?.join(', ') || 'None'}</div>
                <div className="mt-1"><strong>Administration Freq:</strong> High Acuity: {selectedSurvey.sections.section7?.highAcuityAdminFreq || '-'} times/day | Ward: {selectedSurvey.sections.section7?.genWardAdminFreq || '-'} times/day</div>
              </div>

              {/* Section 8 */}
              <div className="detail-section">
                <h4>Section 8: Dosage Monitoring & Safety</h4>
                <div><strong>Tracking:</strong> {selectedSurvey.sections.section8?.trackingMethod?.join(', ') || 'None'}</div>
                <div className="mt-1"><strong>Verification System:</strong> Right Patient: {selectedSurvey.sections.section8?.verificationRightPatient || 'No'} | Right Drug: {selectedSurvey.sections.section8?.verificationRightDrug || 'No'} | Right Dose: {selectedSurvey.sections.section8?.verificationRightDose || 'No'} | Right Time: {selectedSurvey.sections.section8?.verificationRightTime || 'No'}</div>
                <div className="mt-1"><strong>Common Errors:</strong> {selectedSurvey.sections.section8?.commonErrors?.join(', ') || 'None'}</div>
                <div><strong>Alerts:</strong> {selectedSurvey.sections.section8?.alertsAvailable?.join(', ') || 'None'}</div>
                <div className="mt-1"><strong>Required Improvements:</strong> {selectedSurvey.sections.section8?.requiredImprovements?.join(', ') || 'None'}</div>
              </div>

              {/* Section 9 */}
              <div className="detail-section">
                <h4>Section 9: Medicine Inventory Flow</h4>
                <div><strong>Flow:</strong> {selectedSurvey.sections.section9?.inventoryFlow?.join(', ') || 'None'} {selectedSurvey.sections.section9?.inventoryFlowOther}</div>
                <div><strong>Presc. to Admin Time:</strong> Emergency: {selectedSurvey.sections.section9?.emergencyTime || '-'}m | Routine: {selectedSurvey.sections.section9?.routineTime || '-'}m</div>
                <div><strong>System:</strong> {selectedSurvey.sections.section9?.inventorySystem?.join(', ') || 'None'} | <strong>Visibility:</strong> {selectedSurvey.sections.section9?.stockVisibility?.join(', ') || 'None'}</div>
                <div><strong>Stock-out Freq:</strong> {selectedSurvey.sections.section9?.stockOutFrequency?.join(', ') || 'None'} | <strong>Expiry Mgmt:</strong> {selectedSurvey.sections.section9?.expiryManagement?.join(', ') || 'None'}</div>
                <div><strong>Reverse Flow:</strong> {selectedSurvey.sections.section9?.reverseFlow?.join(', ') || 'None'}</div>
                <div className="mt-1 text-danger"><strong>Pain Points:</strong> {selectedSurvey.sections.section9?.keyPainPoints?.join(', ') || 'None'}</div>
              </div>

              {/* Section 10 */}
              <div className="detail-section">
                <h4>Section 10: Diagnostics at Bedside</h4>
                <div><strong>Bedside diagnostics:</strong> {selectedSurvey.sections.section10?.diagnostics?.join(', ') || 'None'}</div>
                <div><strong>Turnaround Issues:</strong> {selectedSurvey.sections.section10?.turnaroundIssues || 'No'}</div>
              </div>

              {/* Section 11 */}
              <div className="detail-section">
                <h4>Section 11: Documentation & IT</h4>
                <div><strong>System:</strong> {selectedSurvey.sections.section11?.currentSystem?.join(', ') || 'None'}</div>
                <div><strong>Required Bedside:</strong> {selectedSurvey.sections.section11?.requiredBedside?.join(', ') || 'None'}</div>
                <div className="text-danger"><strong>Issues:</strong> {selectedSurvey.sections.section11?.issues?.join(', ') || 'None'}</div>
              </div>

              {/* Section 12 */}
              <div className="detail-section">
                <h4>Section 12: Nursing Workflow</h4>
                <div><strong>Nurse Ratio:</strong> Ward: {selectedSurvey.sections.section12?.wardNurseRatio || '-'} | ICU: {selectedSurvey.sections.section12?.icuNurseRatio || '-'}</div>
                <div><strong>Time on Non-clinical tasks:</strong> {selectedSurvey.sections.section12?.nonClinicalTime || '0'}%</div>
                <div className="mt-1"><strong>Challenges:</strong> {selectedSurvey.sections.section12?.challenges?.join(', ') || 'None'}</div>
              </div>

              {/* Section 13 */}
              <div className="detail-section">
                <h4>Section 13: Infrastructure</h4>
                <div><strong>Power:</strong> {selectedSurvey.sections.section13?.power?.join(', ') || 'None'} | <strong>Network:</strong> {selectedSurvey.sections.section13?.network?.join(', ') || 'None'}</div>
                <div><strong>Bed Space:</strong> {selectedSurvey.sections.section13?.spaceNearBed?.join(', ') || 'None'}</div>
              </div>

              {/* Section 14 */}
              <div className="detail-section">
                <h4>Section 14: Equipment Gaps</h4>
                <div><strong>Unavailable Devices:</strong> {selectedSurvey.sections.section14?.unavailableDevices || 'None'}</div>
                <div><strong>Sharing Ratio:</strong> 1 monitor per {selectedSurvey.sections.section14?.sharingRatio || '-'} beds</div>
                <div><strong>Maintenance Issues:</strong> {selectedSurvey.sections.section14?.maintenanceIssues?.join(', ') || 'None'}</div>
              </div>

              {/* Section 15 */}
              <div className="detail-section">
                <h4>Section 15: Ideal Bedside Cart Expectations</h4>
                <div><strong>Required Features:</strong> {selectedSurvey.sections.section15?.requiredCartFeatures?.join(', ') || 'None'}</div>
                <div className="mt-1">
                  <strong>Priority (1-5):</strong> 
                  Speed: {selectedSurvey.sections.section15?.prioritySpeed || '-'} | 
                  Accuracy: {selectedSurvey.sections.section15?.priorityAccuracy || '-'} | 
                  Mobility: {selectedSurvey.sections.section15?.priorityMobility || '-'} | 
                  Cost: {selectedSurvey.sections.section15?.priorityCost || '-'} | 
                  Ease: {selectedSurvey.sections.section15?.priorityEaseOfUse || '-'}
                </div>
              </div>

              {/* Section 16 */}
              <div className="detail-section feedback-section">
                <h4>Section 16: User Feedback</h4>
                <div className="feedback-item">
                  <h5>What slows down bedside care the most?</h5>
                  <p>{selectedSurvey.sections.section16?.slowsBedsideCare || 'No feedback provided.'}</p>
                </div>
                <div className="feedback-item">
                  <h5>What is the biggest challenge in medicine handling?</h5>
                  <p>{selectedSurvey.sections.section16?.medicineHandlingChallenge || 'No feedback provided.'}</p>
                </div>
                <div className="feedback-item">
                  <h5>What one improvement would have maximum impact?</h5>
                  <p>{selectedSurvey.sections.section16?.maxImpactImprovement || 'No feedback provided.'}</p>
                </div>
                <div className="feedback-item">
                  <h5>What should an ideal smart bedside cart include?</h5>
                  <p>{selectedSurvey.sections.section16?.idealCartInclude || 'No feedback provided.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
