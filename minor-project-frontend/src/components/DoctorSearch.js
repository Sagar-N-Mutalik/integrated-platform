import React, { useState, useEffect, useCallback } from 'react';
// Correct icons are imported (Info icon is already included)
import { Search, MapPin, Star, Building, Stethoscope, Info } from 'lucide-react';
import './DoctorSearch.css';
import { useToast } from './ToastContext';

const DoctorSearch = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [results, setResults] = useState([]);
    const [searchType, setSearchType] = useState('doctor'); // 'doctor' or 'hospital'
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Districts list matching your data and requirement
    const districts = [
        "Mysuru", // Correct spelling based on JSON
        "Bengaluru", // Assuming correct, double-check your JSON if issues arise
        "Udupi",
        "Raichur",
        "Davangere",
        "Hubli",
        "Shivamogga"
    ];

    // Your specific specialization list
    const specializations = [
       "Cardiology", "Neurology", "Nephrology", "Gastroenterology", "Pulmonology (Respiratory Medicine)",
        "Endocrinology", "Oncology (Cancer Care)", "Urology", "Orthopedics", "General Surgery", "Plastic Surgery",
        "Pediatric Surgery", "Neurosurgery", "Cardiothoracic Surgery", "Vascular Surgery", "ENT (Otorhinolaryngology)",
        "Ophthalmology", "Dermatology", "Psychiatry", "Psychology", "Pediatrics", "Obstetrics and Gynecology",
        "General Medicine", "Critical Care / Intensive Care", "Emergency Medicine", "Radiology", "Pathology",
        "Dentistry", "Anesthesiology", "Physiotherapy", "Diabetology", "Rheumatology", "Hematology", "Nuclear Medicine",
        "Transplant Medicine", "Infectious Diseases", "Pain Management", "Family Medicine", "Geriatrics",
        "Occupational Therapy", "Speech Therapy", "Nutrition and Dietetics"
    ];

    // Fetch initial data (doctors by default) or data for the selected type
    const fetchInitialData = useCallback(async (type = 'doctor') => {
        setLoading(true);
        // *** FIXED: Endpoint MUST start with /api/v1 to match backend ***
        const endpoint = type === 'doctor' ? '/api/v1/search/doctors' : '/api/v1/search/hospitals';
        console.log("Fetching initial data from:", endpoint); // Log the endpoint
        try {
            const token = localStorage.getItem('token'); // Assuming JWT token is needed
            const response = await fetch(endpoint, { // FIXED: Now using correct /api/v1 endpoints
                headers: token ? { 'Authorization': `Bearer ${token}` } : {} // Add token if available
            });
            console.log("Initial fetch response status:", response.status); // Log status

            if (response.ok) {
                const data = await response.json();
                console.log("Initial data received:", data); // Log received data
                setResults(data);
            } else if (response.status === 401 || response.status === 403) {
                 console.error("Auth error fetching initial data");
                 showToast('Session expired. Please log in again.', 'error');
                 setResults([]); // Clear results on auth error
            } else {
                 console.error(`Server error fetching initial data: ${response.status}`);
                 showToast(`Failed to load ${type}s: Server error ${response.status}`, 'error');
                throw new Error(`Server responded with ${response.status}`);
            }
        } catch (error) {
            console.error(`Failed to fetch initial ${type}s:`, error);
            showToast(`Failed to load ${type}s. Could not connect or parse response.`, 'error');
            setResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    }, [showToast]); // Dependency array includes showToast

    // Fetch initial doctors when the component mounts
    useEffect(() => {
        fetchInitialData('doctor');
    }, [fetchInitialData]); // Correct dependency

    // Handle search button click
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setResults([]); // Clear previous results

        const token = localStorage.getItem('token');
        let query = new URLSearchParams();

        // Add parameters based on selections
        if (selectedDistrict) query.append('district', selectedDistrict);

        let urlBase = '';
        if (searchType === 'doctor') {
            if (selectedSpecialization) query.append('specialization', selectedSpecialization);
            if (searchTerm) query.append('fullName', searchTerm); // Use fullName for doctors
             // *** FIXED: Endpoint MUST start with /api/v1 to match backend ***
            urlBase = '/api/v1/search/doctors';
        } else { // searchType === 'hospital'
            // Use 'specialty' for hospital specialty search parameter
            if (selectedSpecialization) query.append('specialty', selectedSpecialization);
             if (searchTerm) query.append('name', searchTerm); // Use name for hospitals
             // *** FIXED: Endpoint MUST start with /api/v1 to match backend ***
            urlBase = '/api/v1/search/hospitals';
        }
        const url = `${urlBase}?${query.toString()}`;
        console.log("Performing search with URL:", url); // Log the search URL

        try {
            const response = await fetch(url, { // FIXED: Now using correct /api/v1 endpoints
                headers: token ? { 'Authorization': `Bearer ${token}` } : {} // Add token if available
            });
             console.log("Search response status:", response.status); // Log status

            if (response.ok) {
                const data = await response.json();
                 console.log("Search results received:", data); // Log results
                setResults(data);
                if (data.length === 0) {
                    showToast('No results found for your search criteria.', 'info');
                }
            } else if (response.status === 401 || response.status === 403) {
                 console.error("Auth error during search");
                 showToast('Session expired. Please log in again.', 'error');
            } else {
                 console.error(`Search failed: Server responded with ${response.status}`);
                 showToast(`Search failed: Server error ${response.status}`, 'error');
                // Don't throw error here to avoid uncaught promise rejection
            }
        } catch (error) {
            console.error('Search fetch failed:', error);
            showToast('Search failed. Could not connect to the server.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle tab switching
    const handleTabChange = (type) => {
        setSearchType(type);
        setSearchTerm(''); // Clear search term on tab change
        setSelectedDistrict('');
        setSelectedSpecialization('');
        fetchInitialData(type); // Fetch initial data for the new type
    };

    // Component to render individual result cards (No changes needed here from last version)
    const ResultCard = ({ item, type }) => (
        <div className="doctor-card">
            <div className="doctor-avatar">
                <div className="avatar-placeholder">
                    {type === 'doctor' ? <Stethoscope size={40} /> : <Building size={40} />}
                </div>
            </div>
            {type === 'doctor' ? (
                <div className="doctor-info">
                    <h3>{item.fullName || 'N/A'}</h3>
                    <p className="specialization">{item.specialization || 'N/A'}</p>
                    <div className="doctor-location"><MapPin size={16} /> <span>{item.hospitalName || 'N/A'}, {item.district || 'N/A'}</span></div>
                    {item.rating != null && <div className="doctor-rating"><Star size={16} fill="currentColor" /> <span>{item.rating} ({item.totalReviews || 0} reviews)</span></div>}
                    {item.consultationFee && <p className="consultation-fee">{item.consultationFee}</p>}
                </div>
            ) : (
                 <div className="doctor-info">
                    <h3>{item.name || 'N/A'}</h3>
                    <p className="hospital-type"><Info size={16} /> Type: {item.c || 'N/A'}</p>
                    <p className="specialization">Specialties: {item.specialties || 'N/A'}</p>
                    <div className="doctor-location"><MapPin size={16} /> <span>{item.address || 'N/A'}, {item.district || 'N/A'}</span></div>
                    {(item.phone1 || item.phone2) && <p className="phone">Phone: {item.phone1}{item.phone2 && item.phone2 !== 'N/A' ? ` / ${item.phone2}` : ''}</p>}
                    {item.email && item.email !== 'N/A' && <p className="email">Email: {item.email}</p>}
                </div>
            )}
        </div>
    );

    return (
        // JSX structure remains the same
         <div className="doctor-search">
            <div className="search-header">
                <h1>Find Doctors & Hospitals</h1>
            </div>

            <div className="search-tabs">
                 <button
                    className={`tab-btn ${searchType === 'doctor' ? 'active' : ''}`}
                    onClick={() => handleTabChange('doctor')}
                >
                    Doctors
                </button>
                <button
                    className={`tab-btn ${searchType === 'hospital' ? 'active' : ''}`}
                    onClick={() => handleTabChange('hospital')}
                >
                    Hospitals
                </button>
            </div>

            <form className="search-filters" onSubmit={handleSearch}>
                <div className="search-box">
                    <Search />
                    <input
                        type="text"
                        placeholder={searchType === 'doctor' ? "Search by doctor name..." : "Search by hospital name..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Districts</option>
                    {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary search-submit-btn" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="doctors-grid">
                {loading ? (
                    <div className="loading">Loading results...</div>
                ) : results.length > 0 ? (
                    results.map((item, index) => (
                        <ResultCard key={item.id || `${searchType}-${index}-${item.name || item.fullName || item.district}`} item={item} type={searchType} />
                    ))
                ) : (
                    <p>No {searchType === 'doctor' ? 'doctors' : 'hospitals'} found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default DoctorSearch;





