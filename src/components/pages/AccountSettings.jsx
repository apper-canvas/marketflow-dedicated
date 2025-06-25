import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import userService from '@/services/api/userService';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await userService.getCurrentUser();
      if (userData) {
        setUser(userData);
        setFormData(userData);
      }
    } catch (error) {
      toast.error('Failed to load user data');
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      };
      
      const updatedUser = await userService.updateProfile(user.Id, profileData);
      setUser(updatedUser);
      setFormData(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      const updatedUser = await userService.updatePreferences(user.Id, formData.preferences);
      setUser(updatedUser);
      setFormData(updatedUser);
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
      console.error('Error updating preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setSaving(true);
      const updatedUser = await userService.updateSecurity(user.Id, formData.security);
      setUser(updatedUser);
      setFormData(updatedUser);
      toast.success('Security settings updated successfully');
    } catch (error) {
      toast.error('Failed to update security settings');
      console.error('Error updating security settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      setSaving(true);
      await userService.changePassword(user.Id, currentPassword, newPassword);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
      console.error('Error changing password:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-surface-800 mb-2">User Not Found</h2>
          <p className="text-surface-600">Unable to load user account data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-800 mb-2">Account Settings</h1>
        <p className="text-surface-600">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-surface-200">
        {/* Tab Navigation */}
        <div className="border-b border-surface-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-surface-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-surface-800 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      value={formData.address?.street || ''}
                      onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                      placeholder="Enter your street address"
                    />
                  </div>
                  <Input
                    label="City"
                    value={formData.address?.city || ''}
                    onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                    placeholder="Enter your city"
                  />
                  <Input
                    label="State"
                    value={formData.address?.state || ''}
                    onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                    placeholder="Enter your state"
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                    placeholder="Enter your ZIP code"
                  />
                  <Input
                    label="Country"
                    value={formData.address?.country || ''}
                    onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                    placeholder="Enter your country"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-surface-800 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-surface-800">Two-Factor Authentication</h4>
                      <p className="text-sm text-surface-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.security?.twoFactorEnabled || false}
                        onChange={(e) => handleNestedInputChange('security', 'twoFactorEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-surface-800">Login Notifications</h4>
                      <p className="text-sm text-surface-600">Get notified when someone logs into your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.security?.loginNotifications || false}
                        onChange={(e) => handleNestedInputChange('security', 'loginNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-surface-800 mb-4">Change Password</h3>
                <PasswordChangeForm onSubmit={handleChangePassword} />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSecurity}
                  disabled={saving}
                  className="px-6"
                >
                  {saving ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-surface-800 mb-4">General Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Language</label>
                    <select
                      value={formData.preferences?.language || 'en'}
                      onChange={(e) => handleNestedInputChange('preferences', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Currency</label>
                    <select
                      value={formData.preferences?.currency || 'USD'}
                      onChange={(e) => handleNestedInputChange('preferences', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Timezone</label>
                    <select
                      value={formData.preferences?.timezone || 'America/Los_Angeles'}
                      onChange={(e) => handleNestedInputChange('preferences', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/New_York">Eastern Time</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-6"
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-surface-800 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional offers and updates' },
                    { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes' },
                    { key: 'dealAlerts', label: 'Deal Alerts', desc: 'Be notified about special deals and discounts' },
                    { key: 'newsletterSubscription', label: 'Newsletter', desc: 'Subscribe to our weekly newsletter' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-surface-800">{item.label}</h4>
                        <p className="text-sm text-surface-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences?.[item.key] || false}
                          onChange={(e) => handleNestedInputChange('preferences', item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-6"
                >
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PasswordChangeForm = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error handled by parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        placeholder="Enter current password"
      />
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        placeholder="Enter new password"
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        placeholder="Confirm new password"
      />
      <Button
        type="submit"
        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
        className="w-full"
      >
        {loading ? 'Changing Password...' : 'Change Password'}
      </Button>
    </form>
  );
};

export default AccountSettings;