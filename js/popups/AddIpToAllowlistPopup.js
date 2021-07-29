'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	TypesUtils = require('%PathToCoreWebclientModule%/js/utils/Types.js'),

	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	ConfirmPopup = require('%PathToCoreWebclientModule%/js/popups/ConfirmPopup.js'),
	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js')
;

/**
 * @constructor
 */
function CAddIpToAllowlistPopup()
{
	CAbstractPopup.call(this);

	this.aAllowedIpAddresses = [];
	this.fCallback = null;
	this.ip = ko.observable('');
	this.ipFocus = ko.observable(true);
	this.comment = ko.observable('');
	this.inProgress = ko.observable(false);
}

_.extendOwn(CAddIpToAllowlistPopup.prototype, CAbstractPopup.prototype);

CAddIpToAllowlistPopup.prototype.PopupTemplate = '%ModuleName%_AddIpToAllowlistPopup';

CAddIpToAllowlistPopup.prototype.onOpen = function (aAllowedIpAddresses, fCallback)
{
	this.aAllowedIpAddresses = aAllowedIpAddresses;
	this.fCallback = fCallback;
	this.ip('');
	this.ipFocus(true);
	this.comment('');
};

CAddIpToAllowlistPopup.prototype.isIpValid = function (sIp)
{
	if (sIp === '')
	{
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_IP_EMPTY'));
		this.ipFocus(true);
		return false;
	}
	else
	{
		var bIpIsValid = false;
		var aIpParts = sIp.split('.');
		if (aIpParts.length === 4)
		{
			var bAllPartsValid = true;
			_.each(aIpParts, function (sIpPart){
				var iIpPart = TypesUtils.pInt(sIpPart);
				if (sIpPart === '' || sIpPart !== iIpPart.toString() || iIpPart < 0 || iIpPart > 255)
				{
					bAllPartsValid = false;
				}
			});
			bIpIsValid = bAllPartsValid;
		}

		if (!bIpIsValid)
		{
			Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_IP_NOT_VALID'));
			this.ipFocus(true);
			return false;
		}
	}
	return true;
};

CAddIpToAllowlistPopup.prototype.validateAndAddIp = function ()
{
	var sIp = $.trim(this.ip());
	if (this.isIpValid(sIp))
	{
		if (sIp !== Settings.CurrentIP && this.aAllowedIpAddresses.indexOf(Settings.CurrentIP) === -1)
		{
			var sConfirm = TextUtils.i18n('%MODULENAME%/CONFIRM_NOT_CURRENT_IP', { 'CURRENTIP': Settings.CurrentIP });
			Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(function (bProceed) {
				if (bProceed)
				{
					this.addIp(sIp);
				}
			}, this), '', TextUtils.i18n('%MODULENAME%/ACTION_PROCEED')]);
		}
		else
		{
			this.addIp(sIp);
		}
	}
};

CAddIpToAllowlistPopup.prototype.addIp = function (sIp)
{
	var oParameters = {
		'IP': sIp,
		'Comment': $.trim(this.comment())
	};
	this.inProgress(true);
	Ajax.send('%ModuleName%', 'AddIpToAllowlist', oParameters, this.onAddIpToAllowlistResponse, this);
};

CAddIpToAllowlistPopup.prototype.onAddIpToAllowlistResponse = function (oResponse)
{
	this.inProgress(false);
	if (oResponse && oResponse.Result)
	{
		Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_ADD_IP'));
		this.close(true);
	}
	else
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_ADD_IP'));
	}
};

CAddIpToAllowlistPopup.prototype.close = function (bIpIsAdded)
{
	if (_.isFunction(this.fCallback))
	{
		this.fCallback(!!bIpIsAdded);
	}
	this.closePopup();
};

module.exports = new CAddIpToAllowlistPopup();
