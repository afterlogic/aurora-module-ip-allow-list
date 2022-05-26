import IpAllowListAdminSettingsPerUser from './components/IpAllowListAdminSettingsPerUser'

export default {
  moduleName: 'IPAllowList',

  requiredModules: [],

  getAdminUserTabs() {
    return [
      {
        tabName: 'ip-allowlist',
        tabTitle: 'IPALLOWLIST.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
          { path: 'search/:search/id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
          { path: 'page/:page/id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
          { path: 'search/:search/page/:page/id/:id/ip-allowlist', component: IpAllowListAdminSettingsPerUser },
        ],
      },
    ]
  },
}
