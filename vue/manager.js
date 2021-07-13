export default {
    moduleName: 'IPAllowList',

    requiredModules: ['IPAllowList'],

    getAdminUserTabs () {
        return [
            {
                tabName: 'ip-allowlist',
                title: 'IPALLOWLIST.LABEL_SETTINGS_TAB',
                paths: [
                    'id/:id/ip-allowlist',
                    'search/:search/id/:id/ip-allowlist',
                    'page/:page/id/:id/ip-allowlist',
                    'search/:search/page/:page/id/:id/ip-allowlist',
                ],
                component () {
                    return import('./components/IpAllowListAdminSettingsPerUser')
                },
            },
        ]
    },
}
