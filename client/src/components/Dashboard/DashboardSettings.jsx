import React, { useState, useContext } from 'react';
import { Switch } from '@headlessui/react';
import { Bell, Clock, Mail, Globe, Lock, Shield, Save } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DashboardSettings = () => {
    const { backendUrl, userToken, userData } = useContext(AppContext);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        emailNotifications: {
            jobAlerts: true,
            applicationUpdates: true,
            interviews: true,
            marketingEmails: false
        },
        privacy: {
            profileVisibility: 'public',
            resumeVisibility: 'connections'
        },
        security: {
            twoFactorAuth: false
        }
    });

    const handleToggleChange = (section, setting) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [setting]: !prev[section][setting]
            }
        }));
    };

    const handleRadioChange = (section, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [setting]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Simulation of API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Example API call (uncomment and modify as needed)
            /*
            const response = await axios.put(
                `${backendUrl}/api/users/settings`, 
                settings,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            */

            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your notifications, privacy, and security settings</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {/* Email Notifications */}
                <div className="mb-8">
                    <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                        <Mail size={18} className="mr-2 text-gray-500" />
                        Email Notifications
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Job Alerts</p>
                                <p className="text-xs text-gray-500">Receive notifications about new jobs matching your interests</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications.jobAlerts}
                                onChange={() => handleToggleChange('emailNotifications', 'jobAlerts')}
                                className={`${settings.emailNotifications.jobAlerts ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                <span className={`${settings.emailNotifications.jobAlerts ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Application Updates</p>
                                <p className="text-xs text-gray-500">Receive updates on your job applications</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications.applicationUpdates}
                                onChange={() => handleToggleChange('emailNotifications', 'applicationUpdates')}
                                className={`${settings.emailNotifications.applicationUpdates ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                <span className={`${settings.emailNotifications.applicationUpdates ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Interview Reminders</p>
                                <p className="text-xs text-gray-500">Receive reminders about upcoming interviews</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications.interviews}
                                onChange={() => handleToggleChange('emailNotifications', 'interviews')}
                                className={`${settings.emailNotifications.interviews ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                <span className={`${settings.emailNotifications.interviews ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Marketing Emails</p>
                                <p className="text-xs text-gray-500">Receive promotional emails about features and tips</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications.marketingEmails}
                                onChange={() => handleToggleChange('emailNotifications', 'marketingEmails')}
                                className={`${settings.emailNotifications.marketingEmails ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                <span className={`${settings.emailNotifications.marketingEmails ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                        </div>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="mb-8">
                    <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                        <Globe size={18} className="mr-2 text-gray-500" />
                        Privacy Settings
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Profile Visibility</p>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        id="profilePublic"
                                        name="profileVisibility"
                                        type="radio"
                                        checked={settings.privacy.profileVisibility === 'public'}
                                        onChange={() => handleRadioChange('privacy', 'profileVisibility', 'public')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="profilePublic" className="ml-2 block text-sm text-gray-700">
                                        Public - Visible to all users
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="profileConnections"
                                        name="profileVisibility"
                                        type="radio"
                                        checked={settings.privacy.profileVisibility === 'connections'}
                                        onChange={() => handleRadioChange('privacy', 'profileVisibility', 'connections')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="profileConnections" className="ml-2 block text-sm text-gray-700">
                                        Connections - Only visible to companies you've applied to
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="profilePrivate"
                                        name="profileVisibility"
                                        type="radio"
                                        checked={settings.privacy.profileVisibility === 'private'}
                                        onChange={() => handleRadioChange('privacy', 'profileVisibility', 'private')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="profilePrivate" className="ml-2 block text-sm text-gray-700">
                                        Private - Not visible in search results
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Resume Visibility</p>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        id="resumePublic"
                                        name="resumeVisibility"
                                        type="radio"
                                        checked={settings.privacy.resumeVisibility === 'public'}
                                        onChange={() => handleRadioChange('privacy', 'resumeVisibility', 'public')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="resumePublic" className="ml-2 block text-sm text-gray-700">
                                        Public - Visible to all recruiters
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="resumeConnections"
                                        name="resumeVisibility"
                                        type="radio"
                                        checked={settings.privacy.resumeVisibility === 'connections'}
                                        onChange={() => handleRadioChange('privacy', 'resumeVisibility', 'connections')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="resumeConnections" className="ml-2 block text-sm text-gray-700">
                                        Connections - Only visible when you apply
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="resumePrivate"
                                        name="resumeVisibility"
                                        type="radio"
                                        checked={settings.privacy.resumeVisibility === 'private'}
                                        onChange={() => handleRadioChange('privacy', 'resumeVisibility', 'private')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="resumePrivate" className="ml-2 block text-sm text-gray-700">
                                        Private - Only visible when you explicitly share
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="mb-8">
                    <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                        <Shield size={18} className="mr-2 text-gray-500" />
                        Security
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <Switch
                                checked={settings.security.twoFactorAuth}
                                onChange={() => handleToggleChange('security', 'twoFactorAuth')}
                                className={`${settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                <span className={`${settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                        </div>

                        <div>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Lock size={16} className="mr-2" />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DashboardSettings;
// import React, { useState, useContext } from 'react';
// import { AppContext } from '../../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import {
//     Settings, Bell, Shield, Eye, EyeOff, Save, LogOut,
//     Mail, Lock, ToggleLeft, ToggleRight, AlertTriangle, Check
// } from 'lucide-react';

// const DashboardSettings = () => {
//     const { backendUrl, userToken, userData, logoutUser } = useContext(AppContext);

//     // Email notification settings
//     const [emailSettings, setEmailSettings] = useState({
//         newJobAlerts: true,
//         applicationUpdates: true,
//         interviewInvitations: true,
//         profileViews: false,
//         marketingEmails: false
//     });

//     // Security settings
//     const [showPasswordForm, setShowPasswordForm] = useState(false);
//     const [passwordData, setPasswordData] = useState({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//     });
//     const [showPasswords, setShowPasswords] = useState({
//         current: false,
//         new: false,
//         confirm: false
//     });

//     // Account settings
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [deleteConfirmText, setDeleteConfirmText] = useState('');

//     // Privacy settings
//     const [privacySettings, setPrivacySettings] = useState({
//         profileVisible: true,
//         showResume: true,
//         allowMessaging: true,
//         shareApplicationData: false
//     });

//     // Status indicator for saving
//     const [saving, setSaving] = useState({
//         email: false,
//         password: false,
//         privacy: false
//     });

//     // Handle email notification toggle
//     const handleEmailToggle = (setting) => {
//         setEmailSettings(prev => ({
//             ...prev,
//             [setting]: !prev[setting]
//         }));
//     };

//     // Handle privacy settings toggle
//     const handlePrivacyToggle = (setting) => {
//         setPrivacySettings(prev => ({
//             ...prev,
//             [setting]: !prev[setting]
//         }));
//     };

//     // Handle password input changes
//     const handlePasswordChange = (e) => {
//         const { name, value } = e.target;
//         setPasswordData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     // Toggle password visibility
//     const togglePasswordVisibility = (field) => {
//         setShowPasswords(prev => ({
//             ...prev,
//             [field]: !prev[field]
//         }));
//     };

//     // Save email notification settings
//     const saveEmailSettings = async () => {
//         try {
//             setSaving(prev => ({ ...prev, email: true }));

//             // Simulated API call
//             await new Promise(resolve => setTimeout(resolve, 800));

//             // This would be the actual API call in a real application
//             // await axios.put(`${backendUrl}/api/users/settings/notifications`, emailSettings, {
//             //     headers: { 'Authorization': `Bearer ${userToken}` }
//             // });

//             toast.success('Notification settings updated successfully');
//         } catch (error) {
//             console.error('Error saving notification settings:', error);
//             toast.error('Failed to save notification settings');
//         } finally {
//             setSaving(prev => ({ ...prev, email: false }));
//         }
//     };

//     // Save privacy settings
//     const savePrivacySettings = async () => {
//         try {
//             setSaving(prev => ({ ...prev, privacy: true }));

//             // Simulated API call
//             await new Promise(resolve => setTimeout(resolve, 800));

//             // This would be the actual API call in a real application
//             // await axios.put(`${backendUrl}/api/users/settings/privacy`, privacySettings, {
//             //     headers: { 'Authorization': `Bearer ${userToken}` }
//             // });

//             toast.success('Privacy settings updated successfully');
//         } catch (error) {
//             console.error('Error saving privacy settings:', error);
//             toast.error('Failed to save privacy settings');
//         } finally {
//             setSaving(prev => ({ ...prev, privacy: false }));
//         }
//     };

//     // Change password
//     const changePassword = async (e) => {
//         e.preventDefault();

//         // Validation
//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             toast.error('New passwords do not match');
//             return;
//         }

//         if (passwordData.newPassword.length < 8) {
//             toast.error('Password must be at least 8 characters');
//             return;
//         }

//         try {
//             setSaving(prev => ({ ...prev, password: true }));

//             // This would be the actual API call in a real application
//             // await axios.put(`${backendUrl}/api/users/change-password`, {
//             //     currentPassword: passwordData.currentPassword,
//             //     newPassword: passwordData.newPassword
//             // }, {
//             //     headers: { 'Authorization': `Bearer ${userToken}` }
//             // });

//             // Simulated API call
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             toast.success('Password changed successfully');
//             setPasswordData({
//                 currentPassword: '',
//                 newPassword: '',
//                 confirmPassword: ''
//             });
//             setShowPasswordForm(false);
//         } catch (error) {
//             console.error('Error changing password:', error);
//             toast.error('Failed to change password');
//         } finally {
//             setSaving(prev => ({ ...prev, password: false }));
//         }
//     };

//     // Delete account
//     const deleteAccount = async () => {
//         if (deleteConfirmText !== 'DELETE') {
//             toast.error('Please type DELETE to confirm account deletion');
//             return;
//         }

//         try {
//             // This would be the actual API call in a real application
//             // await axios.delete(`${backendUrl}/api/users/account`, {
//             //     headers: { 'Authorization': `Bearer ${userToken}` }
//             // });

//             // Simulated API call
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             toast.success('Account deleted successfully');
//             logoutUser(); // Redirect to home page
//         } catch (error) {
//             console.error('Error deleting account:', error);
//             toast.error('Failed to delete account');
//         }
//     };

//     return (
//         <div className="bg-white rounded-lg shadow-sm">
//             <div className="p-6 border-b border-gray-200 flex items-center">
//                 <Settings size={20} className="text-blue-600 mr-2" />
//                 <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
//             </div>

//             <div className="p-6">
//                 <div className="space-y-8">
//                     {/* Email Notification Settings */}
//                     <div>
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-medium text-gray-900 flex items-center">
//                                 <Bell size={18} className="text-amber-500 mr-2" />
//                                 Email Notifications
//                             </h3>
//                             <button
//                                 onClick={saveEmailSettings}
//                                 disabled={saving.email}
//                                 className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium ${saving.email ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                                     }`}
//                             >
//                                 {saving.email ? (
//                                     <>
//                                         <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save size={16} className="mr-1.5" />
//                                         Save
//                                     </>
//                                 )}
//                             </button>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">New Job Alerts</h4>
//                                     <p className="text-xs text-gray-500">Receive notifications about new jobs matching your preferences</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleEmailToggle('newJobAlerts')}
//                                     className={`${emailSettings.newJobAlerts ? 'text-blue-600' : 'text-gray-400'}`}
//                                     aria-label={emailSettings.newJobAlerts ? 'Disable new job alerts' : 'Enable new job alerts'}
//                                 >
//                                     {emailSettings.newJobAlerts ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Application Updates</h4>
//                                     <p className="text-xs text-gray-500">Get notified when your application status changes</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleEmailToggle('applicationUpdates')}
//                                     className={`${emailSettings.applicationUpdates ? 'text-blue-600' : 'text-gray-400'}`}
//                                     aria-label={emailSettings.applicationUpdates ? 'Disable application updates' : 'Enable application updates'}
//                                 >
//                                     {emailSettings.applicationUpdates ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Interview Invitations</h4>
//                                     <p className="text-xs text-gray-500">Receive notifications for interview invitations</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleEmailToggle('interviewInvitations')}
//                                     className={`${emailSettings.interviewInvitations ? 'text-blue-600' : 'text-gray-400'}`}
//                                     aria-label={emailSettings.interviewInvitations ? 'Disable interview invitations' : 'Enable interview invitations'}
//                                 >
//                                     {emailSettings.interviewInvitations ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Profile Views</h4>
//                                     <p className="text-xs text-gray-500">Get notified when recruiters view your profile</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleEmailToggle('profileViews')}
//                                     className={`${emailSettings.profileViews ? 'text-blue-600' : 'text-gray-400'}`}
//                                     aria-label={emailSettings.profileViews ? 'Disable profile view notifications' : 'Enable profile view notifications'}
//                                 >
//                                     {emailSettings.profileViews ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Marketing Emails</h4>
//                                     <p className="text-xs text-gray-500">Receive updates about new features and career tips</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleEmailToggle('marketingEmails')}
//                                     className={`${emailSettings.marketingEmails ? 'text-blue-600' : 'text-gray-400'}`}
//                                     aria-label={emailSettings.marketingEmails ? 'Disable marketing emails' : 'Enable marketing emails'}
//                                 >
//                                     {emailSettings.marketingEmails ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Privacy Settings */}
//                     <div>
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-medium text-gray-900 flex items-center">
//                                 <Shield size={18} className="text-green-500 mr-2" />
//                                 Privacy Settings
//                             </h3>
//                             <button
//                                 onClick={savePrivacySettings}
//                                 disabled={saving.privacy}
//                                 className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium ${saving.privacy ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                                     }`}
//                             >
//                                 {saving.privacy ? (
//                                     <>
//                                         <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save size={16} className="mr-1.5" />
//                                         Save
//                                     </>
//                                 )}
//                             </button>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Profile Visibility</h4>
//                                     <p className="text-xs text-gray-500">Allow recruiters to find your profile in searches</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handlePrivacyToggle('profileVisible')}
//                                     className={`${privacySettings.profileVisible ? 'text-blue-600' : 'text-gray-400'}`}
//                                 >
//                                     {privacySettings.profileVisible ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Resume Visibility</h4>
//                                     <p className="text-xs text-gray-500">Allow recruiters to download your resume</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handlePrivacyToggle('showResume')}
//                                     className={`${privacySettings.showResume ? 'text-blue-600' : 'text-gray-400'}`}
//                                 >
//                                     {privacySettings.showResume ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Direct Messaging</h4>
//                                     <p className="text-xs text-gray-500">Allow recruiters to send you direct messages</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handlePrivacyToggle('allowMessaging')}
//                                     className={`${privacySettings.allowMessaging ? 'text-blue-600' : 'text-gray-400'}`}
//                                 >
//                                     {privacySettings.allowMessaging ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Application Data</h4>
//                                     <p className="text-xs text-gray-500">Share anonymized application data to improve our service</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handlePrivacyToggle('shareApplicationData')}
//                                     className={`${privacySettings.shareApplicationData ? 'text-blue-600' : 'text-gray-400'}`}
//                                 >
//                                     {privacySettings.shareApplicationData ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Security Settings */}
//                     <div>
//                         <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
//                             <Lock size={18} className="text-purple-500 mr-2" />
//                             Security Settings
//                         </h3>

//                         <div className="bg-gray-50 rounded-lg p-4">
//                             <div className="flex items-center justify-between mb-4">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-700">Password</h4>
//                                     <p className="text-xs text-gray-500">Change your account password</p>
//                                 </div>
//                                 <button
//                                     onClick={() => setShowPasswordForm(!showPasswordForm)}
//                                     className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                                 >
//                                     {showPasswordForm ? 'Cancel' : 'Change Password'}
//                                 </button>
//                             </div>

//                             {showPasswordForm && (
//                                 <form onSubmit={changePassword} className="border-t border-gray-200 pt-4">
//                                     <div className="space-y-4">
//                                         <div>
//                                             <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Current Password
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     type={showPasswords.current ? 'text' : 'password'}
//                                                     id="currentPassword"
//                                                     name="currentPassword"
//                                                     required
//                                                     className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                                     value={passwordData.currentPassword}
//                                                     onChange={handlePasswordChange}
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                                     onClick={() => togglePasswordVisibility('current')}
//                                                 >
//                                                     {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 New Password
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     type={showPasswords.new ? 'text' : 'password'}
//                                                     id="newPassword"
//                                                     name="newPassword"
//                                                     required
//                                                     className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                                     value={passwordData.newPassword}
//                                                     onChange={handlePasswordChange}
//                                                     minLength="8"
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                                     onClick={() => togglePasswordVisibility('new')}
//                                                 >
//                                                     {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
//                                                 </button>
//                                             </div>
//                                             <p className="mt-1 text-xs text-gray-500">
//                                                 Password must be at least 8 characters long.
//                                             </p>
//                                         </div>

//                                         <div>
//                                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Confirm New Password
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     type={showPasswords.confirm ? 'text' : 'password'}
//                                                     id="confirmPassword"
//                                                     name="confirmPassword"
//                                                     required
//                                                     className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                                     value={passwordData.confirmPassword}
//                                                     onChange={handlePasswordChange}
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                                     onClick={() => togglePasswordVisibility('confirm')}
//                                                 >
//                                                     {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         <div className="flex justify-end pt-2">
//                                             <button
//                                                 type="submit"
//                                                 disabled={saving.password}
//                                                 className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${saving.password ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//                                                     }`}
//                                             >
//                                                 {saving.password ? (
//                                                     <>
//                                                         <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                                                         Saving...
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <Check size={16} className="mr-1.5" />
//                                                         Change Password
//                                                     </>
//                                                 )}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </form>
//                             )}
//                         </div>
//                     </div>

//                     {/* Account Management */}
//                     <div>
//                         <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
//                             <Mail size={18} className="text-red-500 mr-2" />
//                             Account Management
//                         </h3>

//                         <div className="bg-gray-50 rounded-lg p-4">
//                             <div className="mb-4">
//                                 <h4 className="text-sm font-medium text-gray-700">Email Address</h4>
//                                 <p className="text-xs text-gray-500 mb-2">Your current email address is:</p>
//                                 <div className="flex items-center p-2 bg-white border border-gray-300 rounded-md">
//                                     <span className="text-sm font-medium text-gray-800">{userData?.userId?.email || 'user@example.com'}</span>
//                                 </div>
//                                 <button
//                                     disabled={true} // Feature not implemented
//                                     className="mt-2 text-sm text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
//                                 >
//                                     Change Email Address
//                                 </button>
//                             </div>

//                             <div className="border-t border-gray-200 pt-4">
//                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Delete Account</h4>
//                                 <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
//                                     <div className="flex">
//                                         <div className="flex-shrink-0">
//                                             <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
//                                         </div>
//                                         <div className="ml-3">
//                                             <h3 className="text-sm font-medium text-red-800">Warning: This action cannot be undone</h3>
//                                             <div className="mt-2 text-sm text-red-700">
//                                                 <p>
//                                                     Deleting your account will permanently remove all your data, including your profile, applications, saved jobs, and interview history.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {!showDeleteConfirm ? (
//                                     <button
//                                         onClick={() => setShowDeleteConfirm(true)}
//                                         className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                                     >
//                                         <LogOut size={16} className="mr-1.5" />
//                                         Delete Account
//                                     </button>
//                                 ) : (
//                                     <div className="border border-red-300 rounded-md p-3">
//                                         <p className="text-sm text-gray-700 mb-2">
//                                             To confirm deletion, type <span className="font-bold">DELETE</span> below:
//                                         </p>
//                                         <input
//                                             type="text"
//                                             value={deleteConfirmText}
//                                             onChange={(e) => setDeleteConfirmText(e.target.value)}
//                                             className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                                             placeholder="Type DELETE to confirm"
//                                         />
//                                         <div className="flex space-x-3">
//                                             <button
//                                                 onClick={deleteAccount}
//                                                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                                             >
//                                                 Permanently Delete Account
//                                             </button>
//                                             <button
//                                                 onClick={() => {
//                                                     setShowDeleteConfirm(false);
//                                                     setDeleteConfirmText('');
//                                                 }}
//                                                 className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                             >
//                                                 Cancel
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardSettings;