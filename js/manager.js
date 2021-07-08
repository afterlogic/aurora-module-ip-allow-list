'use strict';

var
	_ = require('underscore'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

module.exports = function (oAppData) {
	Settings.init(oAppData);

	if (App.isUserNormalOrTenant() && !App.isMobile())
	{
		return {
			/**
			 * Runs before application start. Subscribes to the event before post displaying.
			 * 
			 * @param {Object} ModulesManager
			 */
			start: function (ModulesManager) {
				if (ModulesManager.isModuleEnabled('SecuritySettingsWebclient'))
				{
					ModulesManager.run(
						'SecuritySettingsWebclient',
						'registerSecuritySettingsSection', 
						[
							function () {
								var oIPAllowListSettingsFormView = require('modules/%ModuleName%/js/views/IPAllowListSettingsFormView.js');
								oIPAllowListSettingsFormView.ViewTemplate = '%ModuleName%_IPAllowListSettingsSectionFormView';
								return oIPAllowListSettingsFormView;
							},
							'%ModuleName%'
						]
					);
				}
				else
				{
					ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
						function () { return require('modules/%ModuleName%/js/views/IPAllowListSettingsFormView.js'); },
						'ip-allow-list',
						TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
					]);
				}
			}
		};
	}
	else if (App.getUserRole() === Enums.UserRole.SuperAdmin)
	{
		return {
			/**
			 * Runs before application start. Subscribes to the event before post displaying.
			 * 
			 * @param {Object} ModulesManager
			 */
			start: function (ModulesManager) {
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						require.ensure(
							['modules/%ModuleName%/js/views/IPAllowListAdminSettingsFormView.js'],
							function() {
								resolve(require('modules/%ModuleName%/js/views/IPAllowListAdminSettingsFormView.js'));
							},
							'admin-bundle'
						);
					},
					'ip-allow-list',
					TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
				]);
			}
		};
	}
	
	return null;
};
