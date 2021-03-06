window.PouchDB = require('pouchdb-browser');
window.$ = window.jQuery = require('jquery');
require('../../node_modules/select2/dist/js/select2.full')(window.jQuery);

require('bootstrap');
require('angular');
require('angular-cookie');
require('angular-pouchdb');
require('angular-route');
require('angular-sanitize');
require('angular-translate');
require('angular-translate-interpolation-messageformat');
require('angular-ui-bootstrap');
require('@uirouter/angularjs');

require('ng-redux');

angular.module('controllers', []);
require('./controllers/main');
require('./controllers/authorization-permissions');
require('./controllers/authorization-roles');
require('./controllers/delete-doc-confirm');
require('./controllers/delete-user');
require('./controllers/display-date-time');
require('./controllers/display-languages');
require('./controllers/display-translations');
require('./controllers/edit-language');
require('./controllers/edit-translation');
require('./controllers/edit-user');
require('./controllers/export-contacts');
require('./controllers/export-feedback');
require('./controllers/export-messages');
require('./controllers/export-reports');
require('./controllers/forms-xml');
require('./controllers/icons');
require('./controllers/images-branding');
require('./controllers/images-partners');
require('./controllers/import-translation');
require('./controllers/message-queue');
require('./controllers/sms-forms');
require('./controllers/sms-settings');
require('./controllers/sms-test');
require('./controllers/backup');
require('./controllers/targets');
require('./controllers/targets-edit');
require('./controllers/upgrade');
require('./controllers/upgrade-confirm');
require('./controllers/users');

angular.module('directives', ['ngSanitize']);
require('./directives/modal');
require('./directives/pagination');
require('./directives/relative-date');
require('./directives/release');

// directives we borrow from webapp
angular.module('inboxDirectives', []);
require('../../../webapp/src/js/directives/auth');

angular.module('filters', ['ngSanitize']);
require('./filters/translate-from');
require('./filters/build-version');

// filters we borrow from webapp
angular.module('inboxFilters', []);
require('../../../webapp/src/js/filters/resource-icon');

angular.module('services', []);
require('./services/blob');
require('./services/clean-etag');
require('./services/create-user');
require('./services/delete-user');
require('./services/import-contacts');
require('./services/message-queue');
require('./services/properties');
require('./services/version');

// services we borrow from webapp
angular.module('inboxServices', []);
require('../../../webapp/src/js/services/add-attachment');
require('../../../webapp/src/js/services/auth');
require('../../../webapp/src/js/services/cache');
require('../../../webapp/src/js/services/calendar-interval');
require('../../../webapp/src/js/services/changes');
require('../../../webapp/src/js/services/contact-muted');
require('../../../webapp/src/js/services/contact-types');
require('../../../webapp/src/js/services/contact-view-model-generator');
require('../../../webapp/src/js/services/db');
require('../../../webapp/src/js/services/export');
require('../../../webapp/src/js/services/extract-lineage');
require('../../../webapp/src/js/services/file-reader');
require('../../../webapp/src/js/services/get-data-records');
require('../../../webapp/src/js/services/get-subject-summaries');
require('../../../webapp/src/js/services/get-summaries');
require('../../../webapp/src/js/services/hydrate-contact-names');
require('../../../webapp/src/js/services/json-parse');
require('../../../webapp/src/js/services/language');
require('../../../webapp/src/js/services/languages');
require('../../../webapp/src/js/services/lineage-model-generator');
require('../../../webapp/src/js/services/location');
require('../../../webapp/src/js/services/modal');
require('../../../webapp/src/js/services/resource-icons');
require('../../../webapp/src/js/services/search');
require('../../../webapp/src/js/services/select2-search');
require('../../../webapp/src/js/services/settings');
require('../../../webapp/src/js/services/session');
require('../../../webapp/src/js/services/telemetry');
require('../../../webapp/src/js/services/translate');
require('../../../webapp/src/js/services/translate-from');
require('../../../webapp/src/js/services/translation-loader');
require('../../../webapp/src/js/services/translation-null-interpolation');
require('../../../webapp/src/js/services/update-settings');
require('../../../webapp/src/js/services/update-user');
require('../../../webapp/src/js/services/user');
require('../../../webapp/src/js/actions');
require('../../../webapp/src/js/selectors');
require('../../../webapp/src/js/reducers');

angular.module('adminApp', [
  'ngRoute',
  'controllers',
  'directives',
  'filters',
  'inboxDirectives',
  'inboxFilters',
  'inboxServices',
  'ipCookie',
  'ngRedux',
  'pascalprecht.translate',
  'pouchdb',
  'services',
  'ui.bootstrap',
  'ui.router',
]);

angular.module('adminApp').constant('POUCHDB_OPTIONS', {
  local: { auto_compaction: true },
  remote: {
    skip_setup: true,
    fetch: function(url, opts) {
      opts.headers.set('Accept', 'application/json');
      opts.credentials = 'same-origin';
      return window.PouchDB.fetch(url, opts);
    }
  }
});

angular.module('adminApp').config(function(
  $compileProvider,
  $locationProvider,
  $ngReduxProvider,
  $stateProvider,
  $translateProvider,
  RootReducer
) {
  'ngInject';

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|sms|file|blob):/);

  $locationProvider.hashPrefix('');

  $translateProvider.useLoader('TranslationLoader', {});
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
  $translateProvider.addInterpolation('TranslationNullInterpolation');

  $ngReduxProvider.createStoreWith(RootReducer, []);

  $stateProvider
    .state('display', {
      url: '/display',
      templateUrl: 'templates/display.html'
    })
    .state('display.date-time', {
      url: '/date-time',
      views: {
        tab: {
          controller: 'DisplayDateTimeCtrl',
          templateUrl: 'templates/display_date_time.html'
        }
      }
    })
    .state('display.languages', {
      url: '/languages',
      views: {
        tab: {
          controller: 'DisplayLanguagesCtrl',
          templateUrl: 'templates/display_languages.html'
        }
      }
    })
    .state('display.translations', {
      url: '/translations',
      views: {
        tab: {
          controller: 'DisplayTranslationsCtrl',
          templateUrl: 'templates/display_translations.html'
        }
      }
    })
    .state('backup', {
      url: '/backup',
      controller: 'BackupCtrl',
      templateUrl: 'templates/backup.html'
    })
    .state('users', {
      url: '/users',
      controller: 'UsersCtrl',
      templateUrl: 'templates/users.html'
    })
    .state('export', {
      url: '/export',
      templateUrl: 'templates/export.html'
    })
    .state('export.messages', {
      url: '/messages',
      views: {
        tab: {
          controller: 'ExportMessagesCtrl',
          templateUrl: 'templates/export_messages.html'
        }
      }
    })
    .state('export.reports', {
      url: '/reports',
      views: {
        tab: {
          controller: 'ExportReportsCtrl',
          templateUrl: 'templates/export_reports.html'
        }
      }
    })
    .state('export.contacts', {
      url: '/contacts',
      views: {
        tab: {
          controller: 'ExportContactsCtrl',
          templateUrl: 'templates/export_contacts.html'
        }
      }
    })
    .state('export.feedback', {
      url: '/feedback',
      views: {
        tab: {
          controller: 'ExportFeedbackCtrl',
          templateUrl: 'templates/export_feedback.html'
        }
      }
    })
    .state('forms', {
      url: '/forms',
      controller: 'FormsXmlCtrl',
      templateUrl: 'templates/forms_xml.html'
    })
    .state('sms', {
      url: '/sms',
      templateUrl: 'templates/sms.html'
    })
    .state('sms.settings', {
      url: '/settings',
      views: {
        tab: {
          controller: 'SmsSettingsCtrl',
          templateUrl: 'templates/sms_settings.html'
        }
      }
    })
    .state('sms.forms', {
      url: '/forms',
      views: {
        tab: {
          controller: 'SmsFormsCtrl',
          templateUrl: 'templates/sms_forms.html'
        }
      }
    })
    .state('sms.test', {
      url: '/test',
      views: {
        tab: {
          controller: 'SmsTestCtrl',
          templateUrl: 'templates/sms_test.html'
        }
      }
    })
    .state('images', {
      url: '/images',
      templateUrl: 'templates/images.html'
    })
    .state('images.icons', {
      url: '/icons',
      views: {
        tab: {
          controller: 'IconsCtrl',
          templateUrl: 'templates/images_icons.html'
        }
      }
    })
    .state('images.branding', {
      url: '/branding',
      views: {
        tab: {
          controller: 'ImagesBrandingCtrl',
          templateUrl: 'templates/images_branding.html'
        }
      }
    })
    .state('images.partners', {
      url: '/partners',
      views: {
        tab: {
          controller: 'ImagesPartnersCtrl',
          templateUrl: 'templates/images_partners.html'
        }
      }
    })
    .state('authorization', {
      url: '/authorization',
      templateUrl: 'templates/authorization.html'
    })
    .state('authorization.permissions', {
      url: '/permissions',
      views: {
        tab: {
          controller: 'AuthorizationPermissionsCtrl',
          templateUrl: 'templates/authorization_permissions.html'
        }
      }
    })
    .state('authorization.roles', {
      url: '/roles',
      views: {
        tab: {
          controller: 'AuthorizationRolesCtrl',
          templateUrl: 'templates/authorization_roles.html'
        }
      }
    })
    .state('targets', {
      url: '/targets',
      controller: 'TargetsCtrl',
      templateUrl: 'templates/targets.html'
    })
    .state('targets-edit', {
      url: '/targets/edit/:id',
      controller: 'TargetsEditCtrl',
      templateUrl: 'templates/targets_edit.html',
      params: {
        id: null
      },
    })
    .state('upgrade', {
      url: '/upgrade',
      controller: 'UpgradeCtrl',
      templateUrl: 'templates/upgrade.html'
    })
    .state('message-queue', {
      url: '/message-queue',
      templateUrl: 'templates/message_queue.html',
    })
    .state('message-queue.scheduled', {
      url: '/scheduled?page',
      data: {
        tab: 'scheduled'
      },
      views: {
        tab: {
          controller: 'MessageQueueCtrl',
          templateUrl: 'templates/message_queue_tab.html'
        }
      }
    })
    .state('message-queue.due', {
      url: '/due?page',
      data: {
        tab: 'due'
      },
      views: {
        tab: {
          controller: 'MessageQueueCtrl',
          templateUrl: 'templates/message_queue_tab.html'
        }
      }
    })
    .state('message-queue.muted-future', {
      url: '/will-not-send?page',
      data: {
        tab: 'muted',
        descending: false
      },
      views: {
        tab: {
          controller: 'MessageQueueCtrl',
          templateUrl: 'templates/message_queue_tab.html'
        }
      }
    })
    .state('message-queue.muted-past', {
      url: '/did-not-send?page',
      data: {
        tab: 'muted',
        descending: true
      },
      views: {
        tab: {
          controller: 'MessageQueueCtrl',
          templateUrl: 'templates/message_queue_tab.html'
        }
      }
    });
});

angular.element(document).ready(function() {
  angular.bootstrap(document, [ 'adminApp' ], {
    strictDi: true
  });
});
