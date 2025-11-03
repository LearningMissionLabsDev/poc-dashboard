import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import type { TranslationMessages } from 'react-admin';

/**
 * ✅ Custom English translation bundle
 * Fixes "ra.action.*" showing up as untranslated keys.
 */
const en: TranslationMessages = {
  ...englishMessages,
  ra: {
    ...englishMessages.ra,

    action: {
      ...englishMessages.ra.action,
      add_filter: 'Add Filter',
      add: 'Add',
      back: 'Back',
      bulk_actions: 'Bulk Actions',
      clear_input_value: 'Clear',
      clone: 'Clone',
      confirm: 'Confirm',
      create: 'Create',
      delete: 'Delete',
      edit: 'Edit',
      expand: 'Expand',
      export: 'Export',
      list: 'List',
      refresh: 'Refresh',
      remove_filter: 'Remove this filter',
      remove_all_filters: 'Remove all filters',
      save: 'Save',
      search: 'Search',
      select_all: 'Select All',
      select_row: 'Select this row',
      show: 'Show',
      sort: 'Sort',
      undo: 'Undo',
    },

    navigation: {
      ...englishMessages.ra.navigation,
      page_rows_per_page: 'Rows per page:',
      page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
    },

    notification: {
      ...englishMessages.ra.notification,
      deleted: 'Record deleted',
      created: 'Record created',
      updated: 'Record updated',
      item_doesnt_exist: 'Record no longer exists',
      http_error: 'Server error',
    },
  },
};

/**
 * ✅ i18n provider — single locale, English
 */
export const i18nProvider = polyglotI18nProvider(() => en, 'en');