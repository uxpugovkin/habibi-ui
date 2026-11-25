/*
	EXAMPLE TEXTS — docs pages only.

	Every text that the EXAMPLES show, in English and Arabic side by side.
	The examples never write a word themselves; they take it from here
	(see examples.svelte.js for how).

	Rules for this file:
	- Each text is { en: '…', ar: '…' }. A missing translation is easy to spot.
	- Texts with a number in them are small functions: (n) => `${n} employees`.
	- Things that are the same in every language (logins, e-mails, "SQL", "JSON",
	  domain ids like res-domain-144) are written once, without en / ar.
	- Numbers use the digits 0–9 in both languages.

	The Arabic was written by Claude: have it checked by someone who reads Arabic
	before showing it to people outside the team.
*/

/* ---------- Shared words ---------- */

const words = {
	choose: { en: 'Choose…', ar: 'اختر…' },
	disabled: { en: 'Disabled', ar: 'معطّل' },
	withError: { en: 'With an error', ar: 'مع خطأ' },
	search: { en: 'Search', ar: 'بحث' },
	searchByName: { en: 'Search by name', ar: 'البحث بالاسم' },
	clearSearch: { en: 'Clear search', ar: 'مسح البحث' },
	clear: { en: 'Clear', ar: 'مسح' },
	status: { en: 'Status', ar: 'الحالة' },
	active: { en: 'Active', ar: 'نشط' },
	lastSync: { en: 'Last sync', ar: 'آخر مزامنة' },
	download: { en: 'Download', ar: 'تنزيل' },
	settings: { en: 'Settings', ar: 'الإعدادات' },
	more: { en: 'More', ar: 'المزيد' },
	users: { en: 'Users', ar: 'المستخدمون' },
	model: { en: 'Model', ar: 'النموذج' },
	superAdmin: { en: 'Super admin', ar: 'مسؤول أعلى' },
	tatiana: { en: 'Tatiana Pirog', ar: 'تاتيانا بيروغ' },
	domainAttributes: { en: 'Domain attributes', ar: 'سمات النطاق' },
	rolesAndPrivileges: { en: 'Roles and privileges', ar: 'الأدوار والصلاحيات' },
	delegations: { en: 'Delegations', ar: 'التفويضات' },
	berlin: { en: 'Berlin', ar: 'برلين' },
	lisbon: { en: 'Lisbon', ar: 'لشبونة' },
	dubai: { en: 'Dubai', ar: 'دبي' }
};

/* ---------- The people, departments and offices of the example tables ----------
   Keyed by an id that never changes; employees.js uses the ids. */

const people = {
	jane: { en: 'Jane Cooper', ar: 'جين كوبر' },
	wade: { en: 'Wade Warren', ar: 'وايد وارن' },
	esther: { en: 'Esther Howard', ar: 'إستر هوارد' },
	cameron: { en: 'Cameron Williamson', ar: 'كاميرون ويليامسون' },
	brooklyn: { en: 'Brooklyn Simmons', ar: 'بروكلين سيمونز' },
	leslie: { en: 'Leslie Alexander', ar: 'ليزلي ألكسندر' },
	jenny: { en: 'Jenny Wilson', ar: 'جيني ويلسون' },
	guy: { en: 'Guy Hawkins', ar: 'غاي هوكينز' },
	robert: { en: 'Robert Fox', ar: 'روبرت فوكس' },
	jacob: { en: 'Jacob Jones', ar: 'جاكوب جونز' },
	kristin: { en: 'Kristin Watson', ar: 'كريستين واتسون' },
	cody: { en: 'Cody Fisher', ar: 'كودي فيشر' },
	savannah: { en: 'Savannah Nguyen', ar: 'سافانا نغوين' },
	devon: { en: 'Devon Lane', ar: 'ديفون لين' }
};

const departments = {
	engineering: { en: 'Engineering', ar: 'الهندسة' },
	design: { en: 'Design', ar: 'التصميم' },
	analytics: { en: 'Analytics', ar: 'التحليلات' },
	security: { en: 'Security', ar: 'الأمن' }
};

const offices = { berlin: words.berlin, lisbon: words.lisbon, dubai: words.dubai };

const statuses = { active: words.active };

/* ---------- Texts that live INSIDE components (given to them as props) ---------- */

// For <Table texts={…}>.
const tableTexts = {
	selectAll: { en: 'Select all rows', ar: 'تحديد كل الصفوف' },
	selectRow: { en: 'Select row', ar: 'تحديد الصف' },
	whichRows: { en: 'Which rows to select', ar: 'أي الصفوف تريد تحديدها' },
	rowsOnPage: { en: 'Rows on this page', ar: 'صفوف هذه الصفحة' },
	allRows: { en: 'All rows in the table', ar: 'كل صفوف الجدول' }
};

// For <EmptyState title description>, one per type.
const emptyStates = {
	empty: {
		title: { en: 'Nothing here yet', ar: 'لا يوجد شيء هنا بعد' },
		description: {
			en: "When items are added, they'll show up here. Create the first one to get started.",
			ar: 'ستظهر العناصر هنا عند إضافتها. أنشئ العنصر الأول للبدء.'
		},
		button: { en: 'Create', ar: 'إنشاء' }
	},
	'not-found': {
		title: { en: 'No results found', ar: 'لا توجد نتائج' },
		description: {
			en: 'Nothing matches your search or filters. Try different keywords or clear the filters.',
			ar: 'لا شيء يطابق البحث أو عوامل التصفية. جرّب كلمات أخرى أو امسح عوامل التصفية.'
		},
		button: { en: 'Clear filters', ar: 'مسح عوامل التصفية' }
	},
	error: {
		title: { en: 'Something went wrong', ar: 'حدث خطأ ما' },
		description: {
			en: "We couldn't load this content. Check your connection and try again.",
			ar: 'تعذّر تحميل هذا المحتوى. تحقق من الاتصال ثم حاول مرة أخرى.'
		},
		button: { en: 'Try again', ar: 'إعادة المحاولة' }
	},
	forbidden: {
		title: { en: 'Access denied', ar: 'تم رفض الوصول' },
		description: {
			en: "You don't have permission to view this page. Ask your administrator for access.",
			ar: 'ليست لديك صلاحية لعرض هذه الصفحة. اطلب الوصول من المسؤول.'
		},
		button: { en: 'Request access', ar: 'طلب الوصول' }
	},
	maintenance: {
		title: { en: 'Under maintenance', ar: 'قيد الصيانة' },
		description: {
			en: 'This section is temporarily unavailable while we make improvements. Please check back soon.',
			ar: 'هذا القسم غير متاح مؤقتًا أثناء إجراء التحسينات. يرجى العودة لاحقًا.'
		},
		button: { en: 'Go back', ar: 'رجوع' }
	}
};

/* ==========================================================================
   The texts of each docs section
   ========================================================================== */

export const content = {
	people,
	departments,
	offices,
	statuses,
	tableTexts,
	emptyStates,

	buttons: {
		button: { en: 'Button', ar: 'زر' },
		iconOnly: { en: 'Icon only', ar: 'أيقونة فقط' },
		disabled: words.disabled,
		addUser: { en: 'Add user', ar: 'إضافة مستخدم' },
		run: { en: 'Run', ar: 'تشغيل' },
		json: 'JSON',
		more: words.more,
		moreActions: { en: 'More actions', ar: 'إجراءات أخرى' },
		inUse: { en: 'in use', ar: 'أمثلة' },
		loading: { en: 'Loading', ar: 'جارٍ التحميل' }
	},

	forms: {
		choose: words.choose,
		disabled: words.disabled,
		withError: words.withError,
		// TextInput
		label: { en: 'Label', ar: 'التسمية' },
		placeholder: { en: 'Placeholder', ar: 'نص توضيحي' },
		hint: { en: 'A hint goes here', ar: 'هنا يظهر التلميح' },
		searchAttributes: { en: 'Search attributes', ar: 'البحث في السمات' },
		login: { en: 'Login', ar: 'اسم الدخول' },
		loginValue: 'walker85',
		loginTaken: { en: 'This login is taken', ar: 'اسم الدخول هذا مستخدم' },
		comment: { en: 'Comment', ar: 'تعليق' },
		commentValue: { en: 'Access elevated', ar: 'تم رفع الصلاحيات' },
		cannotChange: { en: 'Cannot change this', ar: 'لا يمكن تغيير هذا' },
		fullName: { en: 'Full name', ar: 'الاسم الكامل' },
		fullNameValue: { en: 'Brenda Gray Cooper', ar: 'بريندا غراي كوبر' },
		// Select
		attributesType: { en: 'Attributes type', ar: 'نوع السمات' },
		attributeTypes: [
			{ value: 'domain', label: words.domainAttributes },
			{ value: 'roles', label: words.rolesAndPrivileges },
			{ value: 'delegations', label: words.delegations }
		],
		oneTwo: [
			{ value: 'one', label: { en: 'One', ar: 'واحد' } },
			{ value: 'two', label: { en: 'Two', ar: 'اثنان' } }
		],
		chooseOne: { en: 'Please choose one', ar: 'يرجى اختيار خيار' },
		compareWith: { en: 'Compare with', ar: 'المقارنة مع' },
		emails: ['constantinopolski.b.e@acme.corp', 'walker85@acme.corp'],
		// MultiSelect
		skills: { en: 'Skills', ar: 'المهارات' },
		skillOptions: ['Go', 'API', 'SQL', 'Rust', 'Ops', 'UX', 'Web'],
		offices: { en: 'Offices', ar: 'المكاتب' },
		officeOptions: [
			{ value: 'berlin', label: words.berlin },
			{ value: 'lisbon', label: words.lisbon },
			{ value: 'dubai', label: words.dubai }
		],
		nothingChosen: { en: 'Nothing chosen yet', ar: 'لم يتم اختيار شيء بعد' },
		chooseAtLeastOne: { en: 'Please choose at least one', ar: 'يرجى اختيار خيار واحد على الأقل' },
		roles: { en: 'Roles', ar: 'الأدوار' },
		roleOptions: [
			{ value: 'admin', label: { en: 'Admin', ar: 'مسؤول' } },
			{ value: 'auditor', label: { en: 'Auditor', ar: 'مدقق' } },
			{ value: 'editor', label: { en: 'Editor', ar: 'محرر' } },
			{ value: 'viewer', label: { en: 'Viewer', ar: 'مشاهد' } },
			{ value: 'owner', label: { en: 'Owner', ar: 'مالك' } },
			{ value: 'guest', label: { en: 'Guest', ar: 'ضيف' } }
		],
		projects: { en: 'Projects', ar: 'المشاريع' },
		projectOptions: [
			{
				value: 'atlas',
				label: { en: 'Atlas', ar: 'أطلس' },
				subtitle: { en: 'Identity platform', ar: 'منصة الهوية' }
			},
			{
				value: 'kestrel',
				label: { en: 'Kestrel', ar: 'العوسق' },
				subtitle: { en: 'SIEM migration', ar: 'ترحيل SIEM' }
			},
			{
				value: 'lumen',
				label: { en: 'Lumen', ar: 'لومن' },
				subtitle: { en: 'Audit tooling', ar: 'أدوات التدقيق' }
			}
		],
		chosen: { en: (count) => `${count} chosen`, ar: (count) => `تم اختيار ${count}` },
		// Checkbox, Radio, Switch, Slider
		title: { en: 'Title', ar: 'العنوان' },
		subtitle: { en: 'Subtitle', ar: 'عنوان فرعي' },
		someSelected: { en: 'Some selected', ar: 'تم اختيار بعضها' },
		free: { en: 'Free', ar: 'مجاني' },
		pro: { en: 'Pro', ar: 'احترافي' },
		billedYearly: { en: 'Billed yearly', ar: 'يُدفع سنويًا' },
		team: { en: 'Team', ar: 'فريق' },
		darkMode: { en: 'Dark mode', ar: 'الوضع الداكن' },
		autoSync: { en: 'Auto sync', ar: 'مزامنة تلقائية' },
		bigSwitch: { en: 'Big switch', ar: 'مفتاح كبير' },
		volume: { en: 'Volume', ar: 'مستوى الصوت' },
		volumeBig: { en: 'Volume, big', ar: 'مستوى الصوت، كبير' },
		disabledBig: { en: 'Disabled, big', ar: 'معطّل، كبير' }
	},

	navigation: {
		disabled: words.disabled,
		// Tabs
		tabs: [
			{ id: 'attributes', label: words.domainAttributes },
			{ id: 'roles', label: words.rolesAndPrivileges },
			{ id: 'delegations', label: words.delegations, icon: 'share' },
			{ id: 'audit', label: { en: 'Audit', ar: 'التدقيق' }, disabled: true }
		],
		// Chip
		mine: { en: 'Mine', ar: 'الخاصة بي' },
		locked: { en: 'Locked', ar: 'مقفل' },
		// Segmented
		views: [
			{ value: 'read', label: { en: 'Read', ar: 'قراءة' }, icon: 'visibility-on' },
			{ value: 'compare', label: { en: 'Comparison', ar: 'مقارنة' }, icon: 'arrows' },
			{ value: 'history', label: { en: 'History', ar: 'السجل' }, icon: 'wait' }
		],
		periods: [
			{ value: 'day', label: { en: 'Day', ar: 'يوم' } },
			{ value: 'week', label: { en: 'Week', ar: 'أسبوع' } },
			{ value: 'month', label: { en: 'Month', ar: 'شهر' } }
		],
		// FilterChip, SearchChip
		status: words.status,
		active: words.active,
		lastSync: words.lastSync,
		search: words.search,
		searchByName: words.searchByName,
		clearSearch: words.clearSearch,
		clear: words.clear,
		cooper: { en: 'Cooper', ar: 'كوبر' },
		searchingFor: { en: 'Searching for:', ar: 'البحث عن:' },
		nothingYet: { en: 'nothing yet', ar: 'لا شيء بعد' },
		// Menu
		actions: { en: 'Actions', ar: 'الإجراءات' },
		rename: { en: 'Rename', ar: 'إعادة التسمية' },
		duplicate: { en: 'Duplicate', ar: 'تكرار' },
		archive: { en: 'Archive', ar: 'أرشفة' },
		sortBy: { en: 'Sort by', ar: 'الترتيب حسب' },
		name: { en: 'Name', ar: 'الاسم' },
		profile: { en: 'Profile', ar: 'الملف الشخصي' },
		signedInAs: { en: 'Signed in as', ar: 'تم تسجيل الدخول باسم' },
		superAdmin: words.superAdmin,
		tatiana: words.tatiana,
		settings: words.settings,
		// Tree (the domain ids are the same in every language)
		users: words.users,
		model: words.model,
		admins: { en: 'Admins', ar: 'المسؤولون' },
		guests: { en: 'Guests', ar: 'الضيوف' },
		// Sidebar
		product: { en: 'Product', ar: 'المنتج' },
		dashboard: { en: 'Dashboard', ar: 'لوحة المعلومات' },
		files: { en: 'Files', ar: 'الملفات' },
		deploy: { en: 'Deploy', ar: 'النشر' }
	},

	status: {
		disabled: { en: 'disabled', ar: 'معطّل' },
		// Tag: one word per colour
		colours: {
			error: { en: 'error', ar: 'خطأ' },
			warning: { en: 'warning', ar: 'تحذير' },
			success: { en: 'success', ar: 'نجاح' },
			progress: { en: 'progress', ar: 'قيد التنفيذ' },
			neutral: { en: 'neutral', ar: 'محايد' }
		},
		// Notification
		userAdded: { en: 'User was added', ar: 'تمت إضافة المستخدم' },
		syncStarted: {
			en: 'Sync started — this can take a minute',
			ar: 'بدأت المزامنة — قد يستغرق ذلك دقيقة'
		},
		noValue: { en: '3 attributes have no value', ar: '3 سمات بلا قيمة' },
		couldNotSave: {
			en: 'Could not save. Close me with the ×',
			ar: 'تعذّر الحفظ. أغلقني بالزر ×'
		},
		nothingChanged: { en: 'Nothing changed', ar: 'لم يتغير شيء' },
		// Tooltip
		downloadJson: { en: 'Download as JSON', ar: 'تنزيل بصيغة JSON' },
		download: words.download,
		lastSync: words.lastSync,
		lastSyncDate: { en: 'Last sync 12.08.2026', ar: 'آخر مزامنة 12.08.2026' },
		// Avatar
		tatiana: words.tatiana,
		brenda: { en: 'Brenda Cooper', ar: 'بريندا كوبر' },
		jane: people.jane,
		anna: { en: 'Anna', ar: 'آنا' },
		boris: { en: 'Boris', ar: 'بوريس' },
		clara: { en: 'Clara', ar: 'كلارا' }
	},

	data: {
		// Table
		columns: {
			fullName: { en: 'Full name', ar: 'الاسم الكامل' },
			department: { en: 'Department', ar: 'القسم' },
			status: words.status,
			office: { en: 'Office', ar: 'المكتب' }
		},
		// Splitter: the panel before the line, the one after it, and the line itself
		first: { en: 'Left', ar: 'يمين' },
		second: { en: 'Right', ar: 'يسار' },
		resize: { en: 'Resize', ar: 'تغيير الحجم' },
		top: { en: 'Top', ar: 'أعلى' },
		bottom: { en: 'Bottom', ar: 'أسفل' }
	},

	// The "Employees" table of the table guidelines
	tables: {
		title: { en: 'Employees', ar: 'الموظفون' },
		columns: {
			fullName: { en: 'Employee', ar: 'الموظف' },
			status: words.status,
			skills: { en: 'Skills', ar: 'المهارات' },
			department: { en: 'Department', ar: 'القسم' },
			office: { en: 'Office', ar: 'المكتب' },
			score: { en: 'Tetris score', ar: 'نقاط تتريس' }
		},
		// The filter tags: their names, and the value each one gets when clicked
		filters: {
			status: { name: words.status, value: words.active },
			skills: { name: { en: 'Skills', ar: 'المهارات' }, value: 'Go, API, SQL' },
			department: { name: { en: 'Department', ar: 'القسم' }, value: departments.engineering },
			office: { name: { en: 'Office', ar: 'المكتب' }, value: words.berlin },
			score: { name: { en: 'Tetris score', ar: 'نقاط تتريس' }, value: '> 20,000' }
		},
		// Toolbar
		search: words.search,
		searchByName: words.searchByName,
		clearSearch: words.clearSearch,
		clear: words.clear,
		filtersButton: { en: 'Filters', ar: 'عوامل التصفية' },
		filtersToShow: { en: 'Filters to show', ar: 'عوامل التصفية المعروضة' },
		reset: { en: 'Reset', ar: 'إعادة تعيين' },
		download: words.download,
		tableSettings: { en: 'Table settings', ar: 'إعدادات الجدول' },
		// Summary row and pager
		employees: { en: (n) => `${n} employees`, ar: (n) => `الموظفون: ${n}` },
		selected: { en: (n) => `${n} selected`, ar: (n) => `المحدد: ${n}` },
		total: { en: 'Total:', ar: 'المجموع:' },
		pageOf: {
			en: (page, last) => `Page ${page} of ${last}`,
			ar: (page, last) => `الصفحة ${page} من ${last}`
		},
		previousPage: { en: 'Previous page', ar: 'الصفحة السابقة' },
		nextPage: { en: 'Next page', ar: 'الصفحة التالية' },
		// Row actions (screen readers hear "<action> <name>")
		rowActions: {
			edit: { en: 'Edit', ar: 'تعديل' },
			download: words.download,
			delete: { en: 'Delete', ar: 'حذف' }
		},
		// The "wrap and cut" example
		longColumn: {
			en: 'Very long column name that needs two lines',
			ar: 'اسم عمود طويل جدًا يحتاج إلى سطرين'
		},
		longName: {
			en: 'Alexandria Montgomery-Fitzgerald Villanueva',
			ar: 'ألكسندريا مونتغمري-فيتزجيرالد فيلانويفا'
		},
		longDepartment: {
			en: 'Platform Reliability Engineering, Operations, Developer Experience and Internal Tooling',
			ar: 'هندسة موثوقية المنصة والعمليات وتجربة المطورين والأدوات الداخلية'
		},
		// The "button placement" examples and the app window around them
		page: { en: 'Page', ar: 'الصفحة' },
		pageTabs: [
			{ id: 'a', label: { en: 'Tab A', ar: 'تبويب أ' } },
			{ id: 'b', label: { en: 'Tab B', ar: 'تبويب ب' } },
			{ id: 'c', label: { en: 'Tab C', ar: 'تبويب ج' } }
		],
		addRow: { en: 'Add row', ar: 'إضافة صف' },
		more: words.more,
		upload: { en: 'Upload', ar: 'رفع' },
		app: {
			currentDomain: { en: 'Current domain', ar: 'النطاق الحالي' },
			menu: [
				{ id: 'dashboard', label: { en: 'Dashboard', ar: 'لوحة المعلومات' }, icon: 'view-grid' },
				{ id: 'users', label: words.users, icon: 'profile' },
				{ id: 'model', label: words.model, icon: 'script' },
				{ id: 'tasks', label: { en: 'Task Manager', ar: 'مدير المهام' }, icon: 'wait' }
			],
			tatiana: words.tatiana,
			superAdmin: words.superAdmin
		}
	},

	// The table settings guide (drawer, popover) and the DragRow demo
	tableSettings: {
		title: { en: 'Table settings', ar: 'إعدادات الجدول' },
		pinnedColumns: { en: 'Pinned columns', ar: 'الأعمدة المثبتة' },
		maxPinned: { en: 'Max 3 columns', ar: '3 أعمدة كحد أقصى' },
		show: { en: 'Show', ar: 'إظهار' },
		hide: { en: 'Hide', ar: 'إخفاء' },
		save: { en: 'Save', ar: 'حفظ' },
		cancel: { en: 'Cancel', ar: 'إلغاء' },
		revert: { en: 'Revert changes', ar: 'التراجع عن التغييرات' },
		close: { en: 'Close', ar: 'إغلاق' },
		download: words.download
	}
};
