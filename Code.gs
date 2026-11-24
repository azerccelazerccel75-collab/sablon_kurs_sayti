/* ═══════════════ НАСТРОЙКИ СЕРВЕРА (меняйте только этот блок) ═══════════════ */
const SCHOOL_NAME = 'Tədris Mərkəzi';   // название курса; должно совпадать с CFG.NAME в index.html
const OWNER_TITLE = 'Kurs rəhbəri';     // как называть руководителя в сообщениях; совпадает с CFG.OWNER в index.html
const MAIN_ADMIN = { name: 'Kurs rəhbəri', login: 'admin', password: 'admin123' };  // главный аккаунт руководителя; пароль смените до первого запуска
const DEVELOPER   = { name: 'Developer', login: 'developer', password: 'dev12345' };   // ваш аккаунт разработчика; обязательно смените пароль
const STUDENT_PREFIX = 'stud';          // начало логина каждого ученика (studaliy, studnigar…)
const STUDENT_PASSWORD = '12345';       // стартовый пароль ученика; при первом входе он задаёт свой
const CERT_PREFIX = 'TM';               // буквы в номере сертификата: TM-2026-AB12CD (2–4 латинские буквы)
const TIMEZONE = 'Asia/Baku';           // часовой пояс курса
const TZ_OFFSET = '+04:00';             // смещение этого пояса от UTC
const SPREADSHEET_URL = '';             // пусто, если скрипт создан внутри таблицы (Расширения → Apps Script)
const TEST_SITE = false;                // true только для тестовой копии: включает инструменты проверки
/* ═══════════════ конец настроек ═══════════════ */
const APP_VERSION = '9.1';
const OLD_ADMIN_NAME = 'Baş admin';
const SESSION_SECONDS = 6 * 60 * 60;
const REMEMBER_DAYS = 90;
const GAME = { fullMonth: 120, fullBonus: 30, passBonus: 15, bonusMin: 5, bonusMax: 20, bonusMonth: 50, rankPct: 50, rankMinAtt: 2, topInd: 10, topGrp: 5, snapDay: 5, growMin: 10 };
const BACKUP_FOLDER = SCHOOL_NAME + ' — ehtiyat nüsxələr';
const BACKUP_KEEP = 8;
const NOTIF_KEEP_DAYS = 10;
const LOG_KEEP_MONTHS = 4;
const ERR_KEEP = 500;
const ERR_KEEP_DAYS = 30;
const ERR_RATE = 30;
const CELL_LIMIT = 10000000;
const ABS_ALERT = 2;
const EDIT_WINDOW_HOURS = 24;
const MAX_LOGIN_FAILS = 5;
const LOGIN_LOCK_MINUTES = 10;
const TRASH_DAYS = 30;
const SURVEY_TTL_DAYS = 14;
const ARCHIVE_MONTHS = 3;
const AUTO_ARCHIVE_DAYS = 28;
const ARCHIVE_BATCH = 4000;

const ARCHIVE_SHEETS = { Logs: 'time', Notifs: 'createdAt', Surveys: 'sentAt', Anns: 'createdAt' };
const ARCHIVE_LABELS = { Logs: 'Jurnal', Notifs: 'Bildirişlər', Surveys: 'Sorğu cavabları', Anns: 'Passiv elanlar' };
const ARCHIVE_NOTES = {
  Logs: 'Əməliyyatlar tarixçəsi. İstifadəçi və əməliyyat növünə görə süzmək olar.',
  Notifs: 'Köhnə bildirişlər.',
  Surveys: 'Arxivlənən cavablar sorğu statistikasından çıxır. Açıq linklərə toxunulmur.',
  Anns: 'Yalnız söndürülmüş elanlar. Aktiv elanlara toxunulmur.'
};
const ARCHIVE_LOCKED = ['Dərslər', 'Tələbələr', 'Müəllimlər', 'Məşğələlər', 'Nailiyyətlər və reytinq', 'Köçürmələr (tələbə tarixçəsi)', 'İmtahanlar və nəticələri'];
const AUTO_ARCHIVE_SHEETS = ['Logs'];
const STALE_DAYS = 14;

const TEST_LIMITS = { teachers: 20, students: 200, courses: 60, lessons: 12 };

const EXAM_GRACE_SEC = 45;
const EXAM_MAX_Q = 150;
const EXAM_MAX_STUDENTS = 300;
const EXAM_MAX_ATTEMPTS = 30;
const EXAM_WARN_LIMIT = 3;
const EXAM_PERSIST_SEC = 120;
const EXAM_CHUNK = 45000;

const IMPORT_PASSWORD = '12345';
const IMPORT_LIMITS = { teachers: 200, students: 3000, courses: 1500, chars: 200000 };

const TRIGGERS = [
  { fn: 'purgeTrashDaily', when: 'hər gün · 04:00', label: 'Zibil qutusunun təmizlənməsi (hər gün)', make: function (b) { return b.timeBased().everyDays(1).atHour(4); } },
  { fn: 'autoArchiveQuarterly', when: 'hər ayın 1-i · 03:00', label: 'Jurnalın arxivi (hər ay, ' + LOG_KEEP_MONTHS + ' aydan köhnə)', make: function (b) { return b.timeBased().onMonthDay(1).atHour(3); } },
  { fn: 'gameDaily', when: 'hər gün · 05:00', label: 'Nailiyyətlər və köhnə sessiyalar (hər gün)', make: function (b) { return b.timeBased().everyDays(1).atHour(5); } },
  { fn: 'ratingMonthly', when: 'hər ayın ' + GAME.snapDay + '-i · 01:00', label: 'Aylıq reytinq (hər ayın ' + GAME.snapDay + '-i)', make: function (b) { return b.timeBased().onMonthDay(GAME.snapDay).atHour(1); } },
  { fn: 'weeklyBackup', when: 'bazar · 03:00', label: 'Həftəlik ehtiyat nüsxə (bazar günü)', make: function (b) { return b.timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(3); } }
];

const SCHEMA = {
  Users:    ['id', 'name', 'login', 'password', 'role', 'permissions', 'createdAt', 'updatedAt', 'deletedAt', 'deletedBy', 'newsSeenAt', 'isTest', 'mustChange', 'subject', 'sessFrom', 'bday', 'bdaySetAt', 'avatar', 'tourAt'],
  Students: ['id', 'name', 'parentName', 'note', 'cardToken', 'status', 'createdAt', 'updatedAt', 'deletedAt', 'deletedBy', 'isTest', 'login', 'password', 'mustChange', 'sessFrom', 'lastSeen', 'lvl', 'noRank', 'statusAt', 'statusNote', 'shareToken', 'bday', 'bdaySetAt', 'avatar', 'avatarFest'],
  Courses:  ['id', 'title', 'type', 'teacherId', 'studentIds', 'lessonsPerMonth', 'monthNo', 'monthStart', 'createdAt', 'updatedAt', 'deletedAt', 'deletedBy', 'isTest', 'closedAt', 'closedFor'],
  Lessons:  ['id', 'lessonId', 'courseId', 'monthNo', 'date', 'studentId', 'status', 'reason', 'topic', 'markedBy', 'markedAt', 'editedBy', 'editedAt'],
  Transfers:['id', 'studentId', 'fromCourseId', 'toCourseId', 'byUser', 'at', 'note'],
  Notifs:   ['id', 'userId', 'type', 'text', 'page', 'param', 'createdAt', 'readAt'],
  Anns:     ['id', 'title', 'body', 'popup', 'active', 'createdBy', 'createdAt', 'updatedAt', 'audience'],
  AnnSeen:  ['id', 'annId', 'userId', 'dismissedAt', 'popupSeenAt'],
  Surveys:  ['id', 'token', 'studentId', 'courseId', 'teacherId', 'monthNo', 'status', 'qVersion', 'questions', 'answers', 'sentBy', 'sentAt', 'answeredAt', 'adminStatus', 'adminNote', 'lowFlag'],
  Changelog:['id', 'title', 'body', 'kind', 'createdBy', 'createdAt'],
  Settings: ['key', 'value', 'updatedAt'],
  Logs:     ['id', 'time', 'userId', 'userName', 'role', 'type', 'action', 'details'],

  Exams:    ['id', 'token', 'title', 'subject', 'note', 'teacherId', 'studentIds', 'keys', 'duration', 'points', 'passMin', 'maxPoints', 'qCount', 'openCount',
             'strict', 'stopOnLimit', 'shuffle', 'reveal', 'active', 'locked', 'createdBy', 'createdAt', 'updatedAt', 'deletedAt', 'deletedBy', 'isTest',
             'questions', 'questions2', 'questions3'],

  ExamResults: ['id', 'examId', 'status', 'studentId', 'startedAt', 'dur', 'deadline', 'finishedAt', 'spent', 'autoScore', 'openScore', 'score', 'maxPoints', 'passMin',
             'openPending', 'violations', 'endReason', 'late', 'marks', 'gradedBy', 'gradedAt', 'savedAt',
             'comment', 'conf', 'vlog', 'grades', 'answers', 'answers2', 'answers3'],
  Sessions: ['token', 'userId', 'kind', 'createdAt', 'lastAt', 'expiresAt'],
  Bonuses:  ['id', 'studentId', 'points', 'reason', 'givenBy', 'createdAt'],
  Badges:   ['id', 'studentId', 'badge', 'earnedAt', 'month', 'by', 'note', 'state'],
  Ratings:  ['id', 'month', 'kind', 'place', 'refId', 'name', 'points', 'extra', 'createdAt'],
  Errors:   ['id', 'key', 'src', 'where', 'msg', 'stack', 'who', 'ua', 'count', 'at', 'lastAt'],
  Shares:   ['day', 'shares', 'opens', 'clicks'],
  Visits:   ['studentId', 'key', 'days', 'updatedAt'],
  Problems: ['id', 'at', 'kind', 'userId', 'name', 'role', 'cat', 'text', 'page', 'ctx', 'status', 'doneAt'],
  Comments: ['id', 'studentId', 'month', 'teacherId', 'text', 'at']
};

const HEAVY = {
  Exams: ['questions', 'questions2', 'questions3'],
  ExamResults: ['comment', 'conf', 'vlog', 'grades', 'answers', 'answers2', 'answers3']
};

const SOFT = { Users: true, Students: true, Courses: true, Exams: true };

const ROLE_LABELS = { superadmin: 'Kurs rəhbəri', teacher: 'Müəllim', helper: 'Köməkçi', developer: 'Developer', student: 'Tələbə' };
const TYPE_LABELS = { individual: 'Fərdi', group: 'Qrup' };
const HELD = 'keçdi';
const ABSENT = 'qayıb';

const PERMISSIONS = [
  { group: 'Tələbələr', items: [
    { key: 'students.view', label: 'Tələbələrə bax' },
    { key: 'students.add', label: 'Tələbə əlavə et' },
    { key: 'students.edit', label: 'Tələbəni redaktə et' },
    { key: 'students.delete', label: 'Tələbəni sil' },
    { key: 'students.reset', label: 'Tələbə şifrələrini sıfırla (bütün tələbələr)' }
  ]},
  { group: 'Müəllimlər', items: [
    { key: 'teachers.view', label: 'Müəllimlərə bax' },
    { key: 'teachers.add', label: 'Müəllim əlavə et' },
    { key: 'teachers.edit', label: 'Müəllimi redaktə et' },
    { key: 'teachers.delete', label: 'Müəllimi sil' },
    { key: 'teachers.passwords', label: 'Şifrələrə bax' }
  ]},
  { group: 'Məşğələlər', items: [
    { key: 'courses.view', label: 'Məşğələlərə bax' },
    { key: 'courses.add', label: 'Məşğələ yarat' },
    { key: 'courses.edit', label: 'Məşğələni redaktə et' },
    { key: 'courses.delete', label: 'Məşğələni sil' },
    { key: 'month.new', label: 'Yeni ay başlat' }
  ]},
  { group: 'Dərs qeydləri', items: [
    { key: 'attendance.view', label: 'Dərs tarixçəsinə bax' },
    { key: 'attendance.mark', label: 'İstənilən məşğələdə dərs qeyd et' },
    { key: 'attendance.edit', label: 'Dərs qeydlərini düzəlt' },
    { key: 'attendance.delete', label: 'Dərs qeydlərini sil' }
  ]},
  { group: 'Nailiyyətlər', items: [
    { key: 'game.bonus', label: 'Bonus vermək (bütün tələbələrə) və bütün reytinqə baxmaq' }
  ]},
  { group: 'Sorğular', items: [
    { key: 'survey.view', label: 'Sorğu cavablarına bax' },
    { key: 'survey.send', label: 'Sorğu linki göndər' },
    { key: 'survey.edit', label: 'Sorğu suallarını redaktə et' }
  ]},
  { group: 'Elanlar', items: [
    { key: 'announce.send', label: 'Elan göndər' }
  ]},
  { group: 'Bayram', items: [
    { key: 'cards.make', label: 'Təbrik kartı hazırla (bayram dövründə)' }
  ]},
  { group: 'İmtahanlar', items: [
    { key: 'exams.view', label: 'Bütün imtahanlara və nəticələrə bax' },
    { key: 'exams.manage', label: 'İstənilən imtahanı yarat, redaktə et və yoxla' },
    { key: 'exams.delete', label: 'İmtahanı və nəticələri sil' }
  ]},
  { group: 'Alətlər', items: [
    { key: 'tools.trash', label: 'Zibil qutusu (bərpa/sil)' },
    { key: 'tools.bulk', label: 'Toplu əməliyyatlar (müəllim dəyişmə, köçürmə)' },
    { key: 'tools.datacheck', label: 'Məlumatların yoxlanışı' },
    { key: 'tools.import', label: 'Toplu idxal (siyahıdan müəllim, tələbə və məşğələ)' }
  ]},
  { group: 'Jurnal', items: [
    { key: 'logs.view', label: 'Jurnala bax' }
  ]}
];

const ALL_PERMS = [];
const PERM_LABEL = {};
PERMISSIONS.forEach(function (g) { g.items.forEach(function (i) { ALL_PERMS.push(i.key); PERM_LABEL[i.key] = i.label; }); });

const IMPLIED = {
  'students.add': ['students.view'], 'students.edit': ['students.view'], 'students.delete': ['students.view'],
  'teachers.add': ['teachers.view'], 'teachers.edit': ['teachers.view'], 'teachers.delete': ['teachers.view'], 'teachers.passwords': ['teachers.view'],
  'courses.add': ['courses.view'], 'courses.edit': ['courses.view'], 'courses.delete': ['courses.view'], 'month.new': ['courses.view'],
  'attendance.mark': ['courses.view'],
  'attendance.edit': ['attendance.view', 'courses.view'], 'attendance.delete': ['attendance.view', 'courses.view'],
  'students.reset': ['students.view'],
  'survey.send': ['students.view'], 'survey.view': ['students.view'],
  'tools.bulk': ['courses.view'],
  'tools.import': ['students.view', 'teachers.view', 'courses.view'],
  'exams.manage': ['exams.view'], 'exams.delete': ['exams.view']
};

const STUDENT_FIELDS = { name: 'Ad Soyad', parentName: 'Valideyn', note: 'Qeyd' };

const DEFAULT_SURVEY = {
  version: 1,
  intro: 'Xidmətlərimizin keyfiyyətini artırmaq üçün bu qısa sorğunu cavablandırmağınızı xahiş edirik. Cavablarınız anonim deyil, lakin yalnız rəhbərlik tərəfindən görünür.',
  questions: [
    { id: 'q1', type: 'scale5', teacher: true, text: 'Müəllimin mövzuları izah etmə bacarığını necə qiymətləndirirsiniz?' },
    { id: 'q2', type: 'scale5', teacher: true, text: 'Bu ay övladınızın biliklərində irəliləyiş hiss edirsinizmi?' },
    { id: 'q3', type: 'choice', options: ['Bəli', 'Qismən', 'Xeyr'], bad: ['Xeyr'], text: 'Övladınız dərslərə həvəslə gedirmi?' },
    { id: 'q4', type: 'scale5', teacher: true, text: 'Müəllimin övladınıza münasibətindən razısınızmı?' },
    { id: 'q5', type: 'scale5', teacher: true, text: 'Müəllim dərsə vaxtında başlayır və dərs vaxtından səmərəli istifadə edirmi?' },
    { id: 'q6', type: 'scale5', teacher: true, text: 'Müəllim övladınızın uğur və çətinlikləri barədə sizə kifayət qədər məlumat verirmi?' },
    { id: 'q7', type: 'choice', options: ['Azdır', 'Normaldır', 'Çoxdur'], text: 'Ev tapşırıqlarının həcmi sizcə necədir?' },
    { id: 'q8', type: 'scale5', text: 'Dərslərin vaxtı və cədvəli sizin üçün rahatdırmı?' },
    { id: 'q9', type: 'nps', text: 'Kursumuzu dost və tanışlarınıza tövsiyə edərdinizmi? (0–10)' },
    { id: 'q10', type: 'text', optional: true, text: 'Təklif və iradlarınızı yazın.' }
  ]
};

function doGet() {
  return json_({ ok: true, message: SCHOOL_NAME + ' API işləyir.' });
}

function doPost(e) {
  var req;
  try {
    req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'Sorğu düzgün deyil.' });
  }
  try {
    try { nyGrantMaybe_(); } catch (e) { console.error(e); }
    try { bdGrantMaybe_(); } catch (e) { console.error(e); }
    var out = handle_(req);
    if (out && out.ok) { try { out.site = sitePub_(); } catch (e) { console.error(e); } }
    return json_(out);
  } catch (err) {
    if (err && err.userMsg) return json_({ ok: false, error: err.message, code: err.code || '' });
    console.error(err && err.stack ? err.stack : err);
    serverError_(req, err);
    return json_({ ok: false, error: 'Serverdə xəta baş verdi: ' + (err && err.message ? err.message : err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

var PUBLIC = {
  maintenanceStatus: { fn: function () { return { maintenance: maint_(), ver: APP_VERSION }; }, lock: false },
  clientError:       { fn: function (req) { return clientError_(req); }, lock: true },
  publicCard:        { fn: function (req) { return publicCard_(req); }, lock: true },
  shareView:         { fn: function (req) { return shareView_(req); }, lock: true },
  shareHit:          { fn: function (req) { return shareHit_(req); }, lock: true },
  publicSurveyInfo:  { fn: function (req) { return publicSurveyInfo_(req); }, lock: true },
  submitSurvey:      { fn: function (req) { return submitSurvey_(req); }, lock: true },
  xInfo:             { fn: function (req) { return xInfo_(req); }, lock: false },
  xStart:            { fn: function (req) { return xStart_(req); }, lock: true },
  xSave:             { fn: function (req) { return xSave_(req); }, lock: false },
  xEvent:            { fn: function (req) { return xEvent_(req); }, lock: true },
  xSubmit:           { fn: function (req) { return xSubmit_(req); }, lock: true },
  xResult:           { fn: function (req) { return xResult_(req); }, lock: false },
  certCheck:         { fn: function (req) { return certCheck_(req); }, lock: false }
};

const ROUTES = {
  bootstrap:      { fn: function () { return {}; }, data: true },
  logout:         { fn: logout_, lock: true },
  logoutAll:      { fn: logoutAll_, lock: true },
  setTheme:       { fn: setTheme_ },
  bdaySet:        { fn: function (u, req) { return bdaySet_('Users', u, req); }, lock: true, data: true },
  bdayList:       { fn: function (u, req) { return bdayList_(u, req); } },
  setAvatar:      { fn: function (u, req) { return avSet_('Users', u, req); }, lock: true, data: true },
  probReport:     { fn: function (u, req) { return probReport_('u', u, req); }, lock: true },
  tourDone:       { fn: function (u) { return tourDone_(u); }, lock: true },
  devProblems:    { fn: function (u, req) { return devProblems_(u, req); }, lock: true },
  dismissInstall: { fn: dismissInstall_ },
  changePassword: { fn: changePassword_, lock: true },

  addStudent:     { fn: addStudent_, lock: true, data: true },
  editStudent:    { fn: editStudent_, lock: true, data: true },
  deleteStudent:  { fn: deleteStudent_, lock: true, data: true },
  getStudentCard: { fn: getStudentCard_, lock: true },
  studentLink:    { fn: studentLink_, lock: true },

  addUser:        { fn: addUser_, lock: true, data: true },
  editUser:       { fn: editUser_, lock: true, data: true },
  deleteUser:     { fn: deleteUser_, lock: true, data: true },
  revealPassword: { fn: revealPassword_, lock: true },

  addCourse:      { fn: addCourse_, lock: true, data: true },
  editCourse:     { fn: editCourse_, lock: true, data: true },
  deleteCourse:   { fn: deleteCourse_, lock: true, data: true },
  newMonth:       { fn: newMonth_, lock: true, data: true },
  transferStudent:{ fn: transferStudent_, lock: true, data: true },

  markLesson:     { fn: markLesson_, lock: true, data: true },
  editLesson:     { fn: editLesson_, lock: true, data: true },
  deleteLesson:   { fn: deleteLesson_, lock: true, data: true },
  getLessons:     { fn: getLessons_ },

  studentLogins:  { fn: studentLogins_, lock: true },
  resetStudentPassword: { fn: resetStudentPassword_, lock: true, data: true },
  gameBoard:      { fn: gameBoard_ },
  gameAudit:      { fn: gameAudit_ },
  gameBadge:      { fn: gameBadge_, lock: true },
  gameRecalc:     { fn: gameRecalc_, lock: true },
  setRankHidden:  { fn: setRankHidden_, lock: true, data: true },
  setStudentStatus: { fn: setStudentStatus_, lock: true, data: true },
  bulkStudentStatus: { fn: bulkStudentStatus_, lock: true, data: true },
  bulkBadge:      { fn: bulkBadge_, lock: true },
  bulkUserLogins: { fn: bulkUserLogins_, lock: true },
  monthReport:    { fn: monthReport_, lock: true },
  certData:       { fn: certData_, lock: true },
  reportComment:  { fn: reportComment_, lock: true },
  teacherStats:   { fn: teacherStats_ },
  backup:         { fn: backupRoute_, lock: true },
  giveBonus:      { fn: giveBonus_, lock: true },
  deleteBonus:    { fn: deleteBonus_, lock: true },
  setGame:        { fn: setGame_, lock: true, data: true },
  siteGet:        { fn: siteGet_ },
  siteSave:       { fn: siteSave_, lock: true },
  seasonSave:     { fn: seasonSave_, lock: true },
  cdSave:         { fn: cdSave_, lock: true },
  simSet:         { fn: simSet_, lock: true },
  simReset:       { fn: simReset_, lock: true },
  cardPeople:     { fn: cardPeople_ },
  devViewStudent: { fn: devViewStudent_ },

  getLogs:        { fn: getLogs_ },
  getDevLog:      { fn: getDevLog_, lock: true },
  setPermissions: { fn: setPermissions_, lock: true, data: true },

  markNotif:      { fn: markNotif_, lock: true },
  markAllNotifs:  { fn: markAllNotifs_, lock: true },

  listAnns:       { fn: listAnns_ },
  saveAnn:        { fn: saveAnn_, lock: true },
  deleteAnn:      { fn: deleteAnn_, lock: true },
  dismissAnn:     { fn: dismissAnn_, lock: true },
  seenPopup:      { fn: seenPopup_, lock: true },

  surveyTargets:  { fn: surveyTargets_ },
  sendSurvey:     { fn: sendSurvey_, lock: true },
  surveyResponses:{ fn: surveyResponses_ },
  setSurveyStatus:{ fn: setSurveyStatus_, lock: true },
  getSurveyQuestions:{ fn: getSurveyQuestions_ },
  saveSurveyQuestions:{ fn: saveSurveyQuestions_, lock: true },

  trashList:      { fn: trashList_ },
  restoreItem:    { fn: restoreItem_, lock: true, data: true },
  purgeItem:      { fn: purgeItem_, lock: true, data: true },
  teacherLeave:   { fn: teacherLeave_, lock: true, data: true },
  moveStudents:   { fn: moveStudents_, lock: true, data: true },
  dataCheck:      { fn: dataCheck_ },

  listChangelog:  { fn: listChangelog_ },
  addChangelog:   { fn: addChangelog_, lock: true },
  deleteChangelog:{ fn: deleteChangelog_, lock: true },
  markNewsSeen:   { fn: markNewsSeen_, lock: true },

  setMaintenance: { fn: setMaintenance_, lock: true },
  devStats:       { fn: devStats_ },
  devHealth:      { fn: devHealth_ },
  devErrors:      { fn: devErrors_, lock: true },
  devSessions:    { fn: devSessions_ },
  devKillSession: { fn: devKillSession_, lock: true },
  archivePreview: { fn: archivePreview_ },
  archiveNow:     { fn: archiveNow_, lock: true },
  archiveAutoNow: { fn: archiveAutoNow_, lock: true },
  archiveInfo:    { fn: archiveInfo_ },
  installTriggers:{ fn: installTriggersRoute_, lock: true },
  testDataInfo:   { fn: testDataInfo_ },
  genTestData:    { fn: genTestData_, lock: true },
  purgeTestData:  { fn: purgeTestData_, lock: true },

  importRun:      { fn: importRun_, lock: true },

  examList:       { fn: examList_ },
  examGet:        { fn: examGet_, lock: true },
  saveExam:       { fn: saveExam_, lock: true, data: true },
  setExamActive:  { fn: setExamActive_, lock: true },
  copyExam:       { fn: copyExam_, lock: true },
  deleteExam:     { fn: deleteExam_, lock: true, data: true },
  examNewLinks:   { fn: examNewLinks_, lock: true },
  examAttempt:    { fn: examAttempt_, lock: true },
  gradeAttempt:   { fn: gradeAttempt_, lock: true, data: true },
  deleteAttempt:  { fn: deleteAttempt_, lock: true, data: true }
};

function handle_(req) {
  var action = String(req.action || '');
  req._at = Date.now();

  if (PUBLIC.hasOwnProperty(action)) {
    var pub = PUBLIC[action];
    var runPub = function () { var res = pub.fn(req) || {}; res.ok = true; return res; };
    return pub.lock ? withLock_(runPub) : runPub();
  }

  if (action === 'login') return withLock_(function () { return login_(req); });

  var user = auth_(req.token);
  if (user.role === 'student') return studentHandle_(action, user, req);
  var route = ROUTES[action];
  if (!route) throw fail_('Naməlum əməliyyat.');
  if (action === 'bootstrap' && req.since && req.since === rev_()) return { ok: true, same: true, rev: req.since };

  if (maintOn_() && user.role !== 'developer' && action !== 'logout') {
    return { ok: false, code: 'MAINT', error: 'Sistemdə texniki işlər aparılır.', maintenance: maint_(),
      me: { id: user.id, name: user.name, role: user.role } };
  }

  if (isTrue_(user.mustChange) && action !== 'changePassword' && action !== 'logout' && action !== 'setTheme') {
    return { ok: false, code: 'PWD', error: 'Davam etmək üçün əvvəlcə şifrənizi dəyişin.',
      me: { id: user.id, name: user.name, login: user.login, role: user.role } };
  }

  var r0 = SAME_OK[action] ? rev_() : '';
  if (r0 && req._since && req._since === r0) return { ok: true, same: true, rev: r0 };
  var run = function () {
    var res;
    try {
      res = route.fn(user, req) || {};
    } catch (err) {
      if (err && err.code === 'PERM') log_(user, 'security', 'İcazəsiz əməliyyat cəhdi', 'Əməliyyat: ' + action + ' — ' + err.message);
      throw err;
    }
    var out = { ok: true };
    Object.keys(res).forEach(function (k) { out[k] = res[k]; });
    if (route.data) out.data = bootstrap_(findUser_(user.id) || user, req);
    if (r0) out.rev = r0;
    return out;
  };
  return route.lock ? withLock_(run) : run();
}

var SAME_OK = { getStudentCard: 1, getLessons: 1, listChangelog: 1, examList: 1, examGet: 1, gameBoard: 1, gameAudit: 1,
  listAnns: 1, surveyTargets: 1, surveyResponses: 1, getSurveyQuestions: 1, trashList: 1, siteGet: 1, cardPeople: 1, bdayList: 1 };

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) throw fail_('Server hazırda məşğuldur. Bir neçə saniyədən sonra yenidən cəhd edin.');
  try {
    var res = fn();
    SpreadsheetApp.flush();
    return res;
  } finally {
    lock.releaseLock();
  }
}

function fail_(msg, code) {
  var e = new Error(msg);
  e.userMsg = true;
  e.code = code || '';
  return e;
}

function setup() {
  migrateV7_();
  Object.keys(SCHEMA).forEach(function (name) {
    var m = meta_(name);
    m.sh.getRange('A:' + colLetter_(m.head.length)).setNumberFormat('@');
  });
  var users = rawRows_('Users');
  var main = users.filter(function (u) { return u.role === 'superadmin'; })[0];
  if (!main) {
    if (users.some(function (u) { return lower_(u.login) === lower_(MAIN_ADMIN.login); })) {
      throw new Error('«' + MAIN_ADMIN.login + '» loginli istifadəçi artıq var. MAIN_ADMIN.login-i dəyişin.');
    }
    insertMany_('Users', [{
      id: newId_('U'), name: MAIN_ADMIN.name, login: MAIN_ADMIN.login, password: MAIN_ADMIN.password,
      role: 'superadmin', permissions: '', createdAt: now_(), updatedAt: '', deletedAt: '', deletedBy: ''
    }]);
    log_(null, 'system', 'Sistem quruldu', 'Əsas hesab yaradıldı. Login: ' + MAIN_ADMIN.login);
    Logger.log('Əsas hesab yaradıldı. Login: ' + MAIN_ADMIN.login + ' | Şifrə: ' + MAIN_ADMIN.password);
  } else if (main.name === OLD_ADMIN_NAME) {

    update_('Users', main, { name: MAIN_ADMIN.name, updatedAt: now_() });
    log_(null, 'system', 'Sistem yeniləndi', 'Əsas hesabın adı «' + OLD_ADMIN_NAME + '» → «' + MAIN_ADMIN.name + '» edildi.');
  }
  var dev = rawRows_('Users').filter(function (u) { return u.role === 'developer'; })[0];
  if (!dev) {
    if (rawRows_('Users').some(function (u) { return lower_(u.login) === lower_(DEVELOPER.login); })) {
      Logger.log('Developer logini məşğuldur, yaradılmadı.');
    } else {
      insertMany_('Users', [{
        id: newId_('U'), name: DEVELOPER.name, login: DEVELOPER.login, password: DEVELOPER.password,
        role: 'developer', permissions: '', createdAt: now_(), updatedAt: '', deletedAt: '', deletedBy: ''
      }]);
      log_(null, 'system', 'Sistem quruldu', 'Developer hesabı yaradıldı. Login: ' + DEVELOPER.login);
      Logger.log('Developer yaradıldı. Login: ' + DEVELOPER.login + ' | Şifrə: ' + DEVELOPER.password);
    }
  }
  if (!settingGet_('survey')) settingSet_('survey', DEFAULT_SURVEY);
  if (!settingGet_('game')) settingSet_('game', { on: true, start: today_() });
  migrateV6_();
  try {
    var created = installTriggers_();
    Logger.log(created.length ? 'Triggerlər quruldu: ' + created.join(', ') : 'Triggerlər artıq qurulub.');
  } catch (e) {
    Logger.log('Triggerləri qurmaq olmadı: ' + e.message + '. Developer panelindən yenidən cəhd edin.');
  }
  if (_setupWarn) throw new Error(_setupWarn);
}
var _setupWarn = '';

function migrateV6_() {
  var taken = takenLogins_(), made = 0;
  var hash = null;
  rawRows_('Students').forEach(function (st) {
    if (st.login) return;
    if (!hash) hash = makePw_(STUDENT_PASSWORD);
    update_('Students', st, { login: studentLoginFor_(st.name, taken), password: hash, mustChange: 'true' });
    made++;
  });
  if (made) log_(null, 'system', 'Tələbələrə login yaradıldı', made + ' tələbə · ilkin şifrə: ' + STUDENT_PASSWORD);
  Logger.log('Tələbə loginləri: ' + made + ' yaradıldı.');
}

var V7_DROP = { Users: ['phone', 'theme', 'installHint'], Students: ['phone', 'parentPhone', 'theme'] };
function migrateV7_() {
  var ss = ss_();
  var plan = [];
  Object.keys(V7_DROP).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh || sh.getLastColumn() < 1) return;
    var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
    var cols = [];
    head.forEach(function (h, i) { if (V7_DROP[name].indexOf(h) !== -1) cols.push(i + 1); });
    if (cols.length) plan.push({ sh: sh, name: name, cols: cols.sort(function (a, b) { return b - a; }), labels: cols.map(function (c) { return head[c - 1]; }) });
  });
  var pay = ss.getSheetByName('Payments');
  if (!plan.length && !pay) return;
  var b;
  try { b = backupNow_('v7 yeniləməsindən əvvəl'); }
  catch (e) {
    _setupWarn = 'Ehtiyat nüsxə alınmadı, köhnə sütunlar və Payments vərəqi silinmədi. Səbəb: ' + e.message + '. Google Drive-a icazə verib setup-ı yenidən işə salın.';
    Logger.log(_setupWarn);
    try { log_(null, 'system', 'Ehtiyat nüsxə alınmadı', e.message); } catch (x) {}
    return;
  }
  var done = [];
  plan.forEach(function (p) {
    p.cols.forEach(function (c) { p.sh.deleteColumn(c); });
    done.push(p.name + ': ' + p.labels.join(', '));
  });
  if (pay) { ss.deleteSheet(pay); done.push('Payments vərəqi'); }
  _meta = {}; _raw = {};
  SpreadsheetApp.flush();
  log_(null, 'system', 'Köhnə məlumatlar silindi (v7)', done.join(' · ') + ' · Əvvəlcə ehtiyat nüsxə çıxarıldı: ' + b.name);
  Logger.log('Silindi: ' + done.join(' · ') + '. Ehtiyat nüsxə: ' + b.url);
}

function gameDaily() {
  job_('gameDaily', function () {
    try { sessPurge_(); } catch (e) { jobErr_(e, 'sessiyalar'); }
    try { cleanupDaily_(); } catch (e) { jobErr_(e, 'təmizlik'); }
    gameDaily_();
  });
}
function ratingMonthly() {
  job_('ratingMonthly', function () { ratingEnsure_(); });
}

function purgeTrashDaily() {
  job_('purgeTrashDaily', function () {
    try { sessPurge_(); } catch (e) { jobErr_(e, 'sessiyalar'); }
    try { examCloseExpired_(null); } catch (e) { jobErr_(e, 'imtahanlar'); }
    Object.keys(SOFT).forEach(function (name) {
      var old = trashRows_(name).filter(function (r) { return ageHours_(r.deletedAt) > TRASH_DAYS * 24; });
      if (!old.length) return;
      if (name === 'Exams') examPurgeResults_(old.map(function (r) { return r.id; }));
      removeRows_(name, old.map(function (r) { return r._row; }));
    });
    SpreadsheetApp.flush();
  });
}

var _ss = null, _meta = {}, _raw = {};

function ss_() {
  if (_ss) return _ss;
  _ss = SPREADSHEET_URL ? SpreadsheetApp.openByUrl(SPREADSHEET_URL) : SpreadsheetApp.getActiveSpreadsheet();
  if (!_ss) throw fail_('Google Cədvəl tapılmadı. Code.gs faylında SPREADSHEET_URL-i yoxlayın.');
  return _ss;
}

function meta_(name) {
  if (_meta[name]) return _meta[name];
  var ss = ss_();
  var sh = ss.getSheetByName(name);
  if (!sh) {

    try { sh = ss.insertSheet(name); } catch (e) { sh = ss.getSheetByName(name); if (!sh) throw e; }
  }
  var lastCol = Math.max(sh.getLastColumn(), 1);
  var head = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
  while (head.length && head[head.length - 1] === '') head.pop();
  var changed = false;
  SCHEMA[name].forEach(function (h) { if (head.indexOf(h) === -1) { head.push(h); changed = true; } });
  if (changed) {
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange('A:' + colLetter_(head.length)).setNumberFormat('@');
  }
  _meta[name] = { sh: sh, head: head };
  return _meta[name];
}

function rawRows_(name) {
  if (_raw[name]) return _raw[name];
  var m = meta_(name);
  var last = m.sh.getLastRow();
  var out = [];
  if (last >= 2) {
    var heavy = HEAVY[name] || null;
    var vals, cols = [];
    if (!heavy) {
      vals = m.sh.getRange(2, 1, last - 1, m.head.length).getValues();
      for (var j = 0; j < m.head.length; j++) cols.push(j);
    } else {

      var blocks = [];
      for (var c = 0; c < m.head.length; c++) {
        if (!m.head[c] || heavy.indexOf(m.head[c]) !== -1) continue;
        var b = blocks[blocks.length - 1];
        if (b && b[0] + b[1] === c) b[1]++; else blocks.push([c, 1]);
        cols.push(c);
      }
      var parts = blocks.map(function (bl) { return m.sh.getRange(2, bl[0] + 1, last - 1, bl[1]).getValues(); });
      vals = [];
      for (var r = 0; r < last - 1; r++) {
        var line = [];
        for (var k = 0; k < parts.length; k++) for (var x = 0; x < blocks[k][1]; x++) line[blocks[k][0] + x] = parts[k][r][x];
        vals.push(line);
      }
    }
    var keyCol = m.head[0];
    for (var i = 0; i < vals.length; i++) {
      var o = { _row: i + 2 };
      if (heavy) o._light = true;
      for (var q = 0; q < cols.length; q++) { var h = m.head[cols[q]]; if (h) o[h] = cell_(vals[i][cols[q]]); }
      if (o[keyCol] !== '' && o[keyCol] != null) out.push(o);
    }
  }
  _raw[name] = out;
  return out;
}

function fullRowAt_(name, rowNum) {
  var m = meta_(name);
  var v = m.sh.getRange(rowNum, 1, 1, m.head.length).getValues()[0];
  var o = { _row: rowNum };
  for (var j = 0; j < m.head.length; j++) if (m.head[j]) o[m.head[j]] = cell_(v[j]);
  return o;
}

function setCells_(name, rowNum, changes) {
  bumpRev_(name);
  var m = meta_(name);
  var idx = Object.keys(changes).map(function (k) { return m.head.indexOf(k); })
    .filter(function (i) { return i !== -1; }).sort(function (a, b) { return a - b; });
  var i = 0;
  while (i < idx.length) {
    var start = idx[i], n = 1;
    while (i + n < idx.length && idx[i + n] === start + n) n++;
    var vals = [];
    for (var k = 0; k < n; k++) vals.push(val_(changes[m.head[start + k]]));
    m.sh.getRange(rowNum, start + 1, 1, n).setValues([vals]);
    i += n;
  }
}

function rows_(name) {
  var all = rawRows_(name);
  if (!SOFT[name]) return all;
  return all.filter(function (r) { return !r.deletedAt; });
}
function trashRows_(name) {
  return rawRows_(name).filter(function (r) { return !!r.deletedAt && !r.closedAt; });
}

function insertMany_(name, objs) {
  if (!objs.length) return;
  bumpRev_(name);
  var m = meta_(name);
  var data = objs.map(function (o) { return m.head.map(function (h) { return val_(o[h]); }); });
  var start = m.sh.getLastRow() + 1;
  var need = start + data.length - 1 - m.sh.getMaxRows();
  if (need > 0) m.sh.insertRowsAfter(m.sh.getMaxRows(), need + 20);
  m.sh.getRange(start, 1, data.length, m.head.length).setValues(data);
  delete _raw[name]; delete _raw[name + '#idx'];
}

function update_(name, rowObj, changes) {
  var m = meta_(name);
  Object.keys(changes).forEach(function (k) { rowObj[k] = changes[k]; });
  bumpRev_(name);
  if (rowObj._light) { setCells_(name, rowObj._row, changes); return; }
  m.sh.getRange(rowObj._row, 1, 1, m.head.length).setValues([m.head.map(function (h) { return val_(rowObj[h]); })]);
}

function removeRows_(name, nums) {
  if (!nums.length) return;
  bumpRev_(name);
  var m = meta_(name);
  var s = nums.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return b - a; });
  if (m.sh.getMaxRows() - s.length < 3) m.sh.insertRowsAfter(m.sh.getMaxRows(), 10);
  var i = 0;
  while (i < s.length) {
    var start = s[i], count = 1;
    while (i + count < s.length && s[i + count] === start - count) count++;
    m.sh.deleteRows(start - count + 1, count);
    i += count;
  }
  delete _raw[name]; delete _raw[name + '#idx'];
}

function cell_(v) {
  if (v === null || v === undefined) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    if (isNaN(v.getTime())) return '';
    var full = Utilities.formatDate(v, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    return /\s00:00:00$/.test(full) ? full.slice(0, 10) : full;
  }
  return String(v);
}
function val_(v) {
  if (v === null || v === undefined) return '';
  var s = String(v);
  if (/^=/.test(s)) s = "'" + s;
  return s;
}
function colLetter_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function settingGet_(key) {
  var r = rawRows_('Settings').filter(function (x) { return x.key === key; })[0];
  if (!r || r.value === '') return null;
  try { return JSON.parse(r.value); } catch (e) { return null; }
}
function settingSet_(key, obj) {
  var r = rawRows_('Settings').filter(function (x) { return x.key === key; })[0];
  var val = JSON.stringify(obj);
  if (r) update_('Settings', r, { value: val, updatedAt: now_() });
  else insertMany_('Settings', [{ key: key, value: val, updatedAt: now_() }]);
}
function maint_() { return settingGet_('maintenance') || { on: false }; }
function maintOn_() { return !!maint_().on; }

function newId_(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function newToken_() { return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''); }
function now_() { return Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss'); }
function today_() { return Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd'); }
function monthKey_() { return Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM'); }
function lower_(s) { return String(s || '').toLowerCase(); }
function fold_(s) {
  return String(s || '').toLocaleLowerCase('az')
    .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/i̇/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g');
}
function digits_(s) { return String(s || '').replace(/\D/g, ''); }
function ageHours_(s) {
  if (!s) return Infinity;
  var t = new Date(String(s).replace(' ', 'T') + TZ_OFFSET).getTime();
  return isNaN(t) ? Infinity : (Date.now() - t) / 36e5;
}
function str_(v, max) { return String(v === null || v === undefined ? '' : v).trim().slice(0, max || 200); }
function reqStr_(v, label, min, max) {
  var s = str_(v, max);
  if (s.length < (min || 1)) throw fail_('«' + label + '» sahəsini doldurun' + (min > 1 ? ' (ən azı ' + min + ' simvol).' : '.'));
  return s;
}
function date_(v) {
  var s = str_(v, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw fail_('Tarix düzgün deyil.');
  var d = new Date(s + 'T12:00:00' + TZ_OFFSET);
  if (isNaN(d.getTime()) || Utilities.formatDate(d, TIMEZONE, 'yyyy-MM-dd') !== s) throw fail_('Tarix düzgün deyil.');
  if (s > today_()) throw fail_('Gələcək tarixi seçmək olmaz.');
  return s;
}
function idList_(s) { return String(s || '').split(',').map(function (x) { return x.trim(); }).filter(String); }

function findUser_(id) { return rows_('Users').filter(function (x) { return x.id === String(id); })[0] || null; }
function findStudent_(id) { return rows_('Students').filter(function (x) { return x.id === String(id); })[0] || null; }
function findCourse_(id) { return rows_('Courses').filter(function (x) { return x.id === String(id); })[0] || null; }
function mustStudent_(id) { var s = findStudent_(id); if (!s) throw fail_('Tələbə tapılmadı. Səhifəni yeniləyin.'); return s; }
function mustCourse_(id) { var c = findCourse_(id); if (!c) throw fail_('Məşğələ tapılmadı. Səhifəni yeniləyin.'); return c; }
function mustUser_(id) { var u = findUser_(id); if (!u) throw fail_('İstifadəçi tapılmadı. Səhifəni yeniləyin.'); return u; }
function studentName_(id) { var s = findStudent_(id); return s ? s.name : '(silinmiş tələbə)'; }
function userName_(id) { var u = findUser_(id); return u ? u.name : (id ? '(silinmiş istifadəçi)' : '—'); }

function courseLabel_(c) {
  if (!c) return '(silinmiş məşğələ)';
  if (c.title) return c.title;
  var names = idList_(c.studentIds).map(studentName_);
  if (c.type === 'individual') return names[0] || 'Fərdi məşğələ';
  return names.slice(0, 2).join(', ') + (names.length > 2 ? ' +' + (names.length - 2) : '');
}
function courseLabelFrom_(c, sMap) {
  if (c.title) return c.title;
  var names = idList_(c.studentIds).map(function (id) { return sMap[id] ? sMap[id].name : '(silinmiş tələbə)'; });
  if (c.type === 'individual') return names[0] || 'Fərdi məşğələ';
  return names.slice(0, 2).join(', ') + (names.length > 2 ? ' +' + (names.length - 2) : '');
}

function permsOf_(u) {
  if (!u) return [];
  if (u.role === 'superadmin' || u.role === 'developer') return ALL_PERMS.slice();
  var list = idList_(u.permissions).filter(function (k) { return ALL_PERMS.indexOf(k) !== -1; });
  return expandPerms_(list);
}
function expandPerms_(list) {
  var set = {};
  list.forEach(function (k) { set[k] = true; (IMPLIED[k] || []).forEach(function (x) { set[x] = true; }); });
  return ALL_PERMS.filter(function (k) { return set[k]; });
}
function can_(u, key) { return u.role === 'superadmin' || permsOf_(u).indexOf(key) !== -1; }
function boss_(u) { return !!u && !u._readOnly && (u.role === 'superadmin' || u.role === 'developer'); }
function need_(u, key) {
  if (!can_(u, key)) throw fail_('Bu əməliyyat üçün icazəniz yoxdur («' + PERM_LABEL[key] + '»).', 'PERM');
}

function log_(user, type, action, details) {
  var m = meta_('Logs');

  var t = (user && user.role === 'developer' && type !== 'auth') ? 'dev' : type;
  var row = {
    id: newId_('L'), time: now_(),
    userId: user ? user.id : '', userName: user ? user.name : '—',
    role: user ? (ROLE_LABELS[user.role] || user.role) : '—',
    type: t, action: action, details: details || ''
  };
  m.sh.appendRow(m.head.map(function (h) { return val_(row[h]); }));
  delete _raw.Logs;
}

function notify_(userIds, type, text, page, param) {
  var seen = {}, rows = [];
  (userIds || []).forEach(function (id) {
    id = String(id || '');
    if (!id || seen[id]) return;
    seen[id] = true;
    rows.push({ id: newId_('N'), userId: id, type: type, text: text, page: page || '', param: param || '', createdAt: now_(), readAt: '' });
  });
  if (rows.length) insertMany_('Notifs', rows);
}
function adminsFor_(perm, exceptId) {
  return rows_('Users').filter(function (u) {
    if (u.id === exceptId) return false;
    if (u.role === 'developer') return false;
    return u.role === 'superadmin' || permsOf_(u).indexOf(perm) !== -1;
  }).map(function (u) { return u.id; });
}

function auth_(token) {
  if (!token) throw fail_('Sessiya bitib. Yenidən daxil olun.', 'AUTH');
  var cache = CacheService.getScriptCache();
  var raw = cache.get('s_' + token), sess = null;
  if (raw) sess = raw.charAt(0) === '{' ? parseJson_(raw, null) : { u: raw, k: 'u', t: 0, r: 0 };
  if (sess && sess.r && cache.get('k_' + sha_(token))) { cache.remove('s_' + token); throw fail_('Sessiya bağlanıb. Yenidən daxil olun.', 'AUTH'); }
  if (!sess) {
    var h = sha_(token);
    var row = rawRows_('Sessions').filter(function (x) { return x.token === h; })[0];
    if (!row || Number(row.expiresAt) < Date.now()) throw fail_('Sessiyanın vaxtı bitib. Yenidən daxil olun.', 'AUTH');
    sess = { u: row.userId, k: row.kind === 's' ? 's' : 'u', t: Number(row.createdAt) || 0, r: 1, l: Number(row.lastAt) || 0 };
  }
  var u = sess.k === 's' ? findStudent_(sess.u) : findUser_(sess.u);
  if (!u || (sess.k === 's' && !stCanEnter_(u))) { sessDrop_(token); throw fail_('Hesabınız bağlanıb. Müəlliminizlə əlaqə saxlayın.', 'AUTH'); }
  if (Number(u.sessFrom || 0) > Number(sess.t || 0)) { sessDrop_(token); throw fail_('Sessiya bitib. Yenidən daxil olun.', 'AUTH'); }
  if (sess.r && Date.now() - Number(sess.l || 0) > 864e5) { sessTouch_(sha_(token)); sess.l = Date.now(); }
  cache.put('s_' + token, JSON.stringify(sess), SESSION_SECONDS);
  if (sess.k === 's') u.role = 'student';
  u._token = token;
  u._sess = sess;
  return u;
}

function login_(req) {
  var login = str_(req.login, 60);
  var pass = String(req.password || '');
  if (!login || !pass) throw fail_('Login və şifrəni daxil edin.');
  var remember = !!req.remember;
  var cache = CacheService.getScriptCache();
  var key = 'f_' + lower_(login);
  var fails = Number(cache.get(key) || 0);
  var isSt = isStudentLogin_(login);
  if (fails >= MAX_LOGIN_FAILS) {
    if (!isSt) log_(null, 'auth', 'Bloklanmış giriş cəhdi', 'Login: ' + login);
    throw fail_('Çoxlu uğursuz cəhd edildi. ' + LOGIN_LOCK_MINUTES + ' dəqiqədən sonra yenidən yoxlayın.');
  }
  if (isSt) {
    var st = rows_('Students').filter(function (x) { return lower_(x.login) === lower_(login); })[0];
    if (st && !stCanEnter_(st) && checkPw_(st.password, pass)) throw fail_('Bu hesab bağlanıb. Yenidən oxumaq istəyirsənsə, müəlliminlə əlaqə saxla.');
    if (!st || !checkPw_(st.password, pass)) {
      cache.put(key, String(fails + 1), LOGIN_LOCK_MINUTES * 60);
      throw fail_('Login və ya şifrə yanlışdır.');
    }
    cache.remove(key);
    st.role = 'student';
    var stok = sessCreate_(st.id, 's', remember, st.sessFrom);
    if (maintOn_()) return { ok: true, token: stok, kind: 's', maintenance: maint_(), me: meOf_(st) };
    if (isTrue_(st.mustChange)) return { ok: true, token: stok, kind: 's', mustChange: true, me: meOf_(st) };
    return { ok: true, token: stok, kind: 's', data: studentBootCore_(st) };
  }
  var u = rows_('Users').filter(function (x) { return lower_(x.login) === lower_(login); })[0];
  if (!u || String(u.password) !== pass) {
    cache.put(key, String(fails + 1), LOGIN_LOCK_MINUTES * 60);
    log_(null, 'auth', 'Uğursuz giriş cəhdi', 'Login: ' + login + (u ? ' (şifrə yanlışdır)' : ' (belə login yoxdur)'));
    throw fail_('Login və ya şifrə yanlışdır.');
  }
  cache.remove(key);
  var token = sessCreate_(u.id, 'u', remember, u.sessFrom);
  var tail = remember ? ' · «Məni yadda saxla»' : '';
  if (maintOn_() && u.role !== 'developer') {
    log_(u, 'auth', 'Sistemə daxil oldu', 'Login: ' + u.login + ' · texniki iş rejimində' + tail);
    return { ok: true, token: token, kind: 'u', maintenance: maint_(), me: meOf_(u) };
  }
  if (isTrue_(u.mustChange)) {
    log_(u, 'auth', 'Sistemə daxil oldu', 'Login: ' + u.login + ' · ilk giriş, şifrə dəyişdirilməlidir' + tail);
    return { ok: true, token: token, kind: 'u', mustChange: true, me: meOf_(u) };
  }
  log_(u, 'auth', 'Sistemə daxil oldu', 'Login: ' + u.login + tail);
  return { ok: true, token: token, kind: 'u', data: bootstrap_(u, req) };
}

function dismissInstall_(u) {
  return {};
}

function logout_(u) {
  sessDrop_(u._token);
  if (u.role !== 'student') log_(u, 'auth', 'Sistemdən çıxdı', '');
  return {};
}

function setTheme_(u, req) {
  return { theme: req.theme === 'dark' ? 'dark' : 'light' };
}

function changePassword_(u, req) {
  var st = u.role === 'student';
  var oldOk = st ? checkPw_(u.password, String(req.oldPassword || '')) : String(req.oldPassword || '') === String(u.password);
  if (!oldOk) throw fail_('Hazırkı şifrə yanlışdır.');
  var np = String(req.newPassword || '');
  if (np.length < 4 || np.length > 50) throw fail_('Yeni şifrə 4–50 simvol olmalıdır.');
  if (/\s/.test(np)) throw fail_('Şifrədə boşluq olmamalıdır.');
  if (st ? checkPw_(u.password, np) : np === String(u.password)) throw fail_('Yeni şifrə hazırkı şifrədən fərqli olmalıdır.');
  var forced = isTrue_(u.mustChange);
  if (forced && lower_(np) === lower_(u.login)) throw fail_('Şifrə loginlə eyni ola bilməz.');
  if (st && np === STUDENT_PASSWORD) throw fail_('Standart şifrəni seçmək olmaz. Başqa şifrə fikirləşin.');
  var t = Date.now() + 1;
  update_(st ? 'Students' : 'Users', u, { password: st ? makePw_(np) : np, mustChange: '', sessFrom: String(t), updatedAt: now_() });
  sessDropFor_(u.id);
  CacheService.getScriptCache().remove('s_' + u._token);
  var token = sessCreate_(u.id, st ? 's' : 'u', !!(u._sess && u._sess.r), t);
  log_(u, 'profile', forced ? 'İlk girişdə şifrəsini dəyişdi' : 'Öz şifrəsini dəyişdi', '');
  return { changed: true, token: token };
}

function bootstrap_(u, req) {

  var viewAs = null, real = null;
  if (u.role === 'developer' && req && req.viewAs) {
    var tgt = findUser_(req.viewAs);
    if (tgt && tgt.role !== 'developer') {
      real = u; viewAs = tgt;

      if (req.viewAsStart) log_(u, 'dev', 'Müəllim gözü ilə baxış', tgt.name + ' (' + ROLE_LABELS[tgt.role] + ')');
      u = Object.assign({}, tgt, { _readOnly: true });
    }
  }

  var isDev = !viewAs && u.role === 'developer';
  var P = permsOf_(u);
  var has = function (k) { return P.indexOf(k) !== -1; };
  var isSuper = u.role === 'superadmin' || isDev;
  var readOnly = !!viewAs;

  var base = {
    me: {
      id: u.id, name: u.name, login: u.login, role: u.role, subject: u.subject || '',
      perms: P, isSuper: isSuper, isDev: isDev, isMain: u.role === 'superadmin',
      readOnly: readOnly,
      viewAs: viewAs ? { id: viewAs.id, name: viewAs.name, role: viewAs.role } : null,
      devName: real ? real.name : '',
      bday: bdMd_(u.bday), bdToday: bdIsToday_(bdMd_(u.bday)), avatar: avOk_(u.avatar, AV_STAFF) || '', tourNeed: u.role === 'teacher' && !u.tourAt
    },
    bdToday: bdTodayIds_(), av: avMap_(), avTop: avTop_(),
    today: today_(), now: now_(), editWindowHours: EDIT_WINDOW_HOURS,
    maintenance: maint_(), rev: rev_(), ver: APP_VERSION,
    changelogCount: rawRows_('Changelog').length,
    staleDays: STALE_DAYS
  };

  var newsSeen = newsSeenAt_(viewAs || u);
  base.me.newsSeenAt = newsSeen;
  base.newsUnread = isDev ? 0 : rawRows_('Changelog').filter(function (c) { return c.createdAt > newsSeen; }).length;

  if (isDev) {

    base.devPanel = {
      teachers: rows_('Users').filter(function (x) { return x.role === 'teacher' || x.role === 'helper' || x.role === 'superadmin'; })
        .map(function (x) { return { id: x.id, name: x.name, role: x.role, login: x.login }; })
        .sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); }),
      students: rows_('Students').map(function (x) { return { id: x.id, name: x.name, login: x.login }; })
        .sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); }),
      sessions: sessStats_(),
      probNew: rawRows_('Problems').filter(function (x) { return x.status === 'new'; }).length
    };
  }

  var users = rows_('Users'), students = rows_('Students'), courses = rows_('Courses'), lessons = rows_('Lessons');
  var sMap = {}; students.forEach(function (s) { sMap[s.id] = s; });
  var uMap = {}; users.forEach(function (x) { uMap[x.id] = x; });
  var byCourse = {};
  lessons.forEach(function (l) { (byCourse[l.courseId] = byCourse[l.courseId] || []).push(l); });

  var visible = has('courses.view') ? courses : courses.filter(function (c) { return c.teacherId === u.id; });
  base.courses = visible.map(function (c) {
    var withLessons = c.teacherId === u.id || has('attendance.view') || has('attendance.mark');
    return courseView_(c, byCourse[c.id] || [], u, P, sMap, uMap, withLessons);
  });

  if (has('students.view')) {
    base.students = students.map(function (s) {
      var o = { id: s.id, name: s.name, parentName: s.parentName, note: s.note, createdAt: s.createdAt, login: s.login, fresh: isTrue_(s.mustChange), seen: !!s.lastSeen,
        status: s.status || 'active', statusAt: s.statusAt || '', statusNote: s.statusNote || '', noRank: isTrue_(s.noRank) };
      if (isTrue_(s.isTest)) o.isTest = true;
      return o;
    });
  } else {
    var need = {};
    if (has('courses.add') || has('courses.edit') || has('tools.bulk')) students.forEach(function (s) { need[s.id] = true; });
    visible.forEach(function (c) { idList_(c.studentIds).forEach(function (id) { need[id] = true; }); });
    var mineS = {};
    courses.forEach(function (c) { if (c.teacherId === u.id) idList_(c.studentIds).forEach(function (id) { mineS[id] = true; }); });
    base.students = students.filter(function (s) { return need[s.id]; }).map(function (s) {
      var o = { id: s.id, name: s.name, status: s.status || 'active' };
      if (mineS[s.id]) { o.login = s.login; o.fresh = isTrue_(s.mustChange); o.seen = !!s.lastSeen; }
      return o;
    });
  }

  base.users = users.map(function (x) {
    var o = { id: x.id, name: x.name, role: x.role };
    var hide = (x.role === 'superadmin' || x.role === 'developer') && !isSuper;
    if (x.role === 'developer' && !isSuper) return null;
    if (x.subject) o.subject = x.subject;
    if (has('teachers.view') && !hide) { o.login = x.login; o.createdAt = x.createdAt; if (isTrue_(x.mustChange)) o.mustChange = true; }
    if (isSuper && x.role !== 'superadmin' && x.role !== 'developer') o.permissions = permsOf_(x);
    if (isTrue_(x.isTest)) o.isTest = true;
    return o;
  }).filter(Boolean);

  if (has('courses.view')) base.stats = { lessons7: heldSince_(lessons, 7) };
  base.absAlerts = absAlerts_(u, P, courses, lessons, sMap, uMap);
  if (has('courses.view')) {
    var rawS = {}; rawRows_('Students').forEach(function (x) { rawS[x.id] = x; });
    base.closedCourses = rawRows_('Courses').filter(function (c) { return c.closedAt && c.deletedAt; }).map(function (c) {
      var st = rawS[c.closedFor];
      return { id: c.id, title: courseLabelFrom_(c, rawS), type: c.type, teacher: uMap[c.teacherId] ? uMap[c.teacherId].name : '', closedAt: c.closedAt,
        student: st ? st.name : '', studentId: c.closedFor, why: st ? st.status || '' : '', lessons: (byCourse[c.id] || []).filter(function (l) { return l.status === HELD; }).length };
    }).sort(function (a, b) { return a.closedAt < b.closedAt ? 1 : -1; });
  }
  base.stuPw = STUDENT_PASSWORD;
  if (has('survey.view')) {
    var answered = rawRows_('Surveys').filter(function (sv) { return sv.status === 'answered' && (sv.adminStatus || 'new') === 'new'; });
    base.surveyAlerts = { fresh: answered.length, low: answered.filter(function (sv) { return sv.lowFlag === 'true'; }).length };
  }

  base.permCatalog = isSuper ? PERMISSIONS : [];
  base.permImplied = isSuper ? IMPLIED : {};

  var myNotifs = rawRows_('Notifs').filter(function (n) { return n.userId === u.id; })
    .sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
  base.notifs = myNotifs.slice(0, 40).map(function (n) {
    return { id: n.id, type: n.type, text: n.text, page: n.page, param: n.param, createdAt: n.createdAt, read: !!n.readAt };
  });
  base.notifUnread = myNotifs.filter(function (n) { return !n.readAt; }).length;

  var seenRows = rawRows_('AnnSeen').filter(function (x) { return x.userId === u.id; });
  var seenMap = {}; seenRows.forEach(function (x) { seenMap[x.annId] = x; });
  var activeAnns = rawRows_('Anns').filter(function (a) { return isTrue_(a.active) && a.audience !== 'students'; })
    .sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
  base.announcements = activeAnns.filter(function (a) { return !(seenMap[a.id] && seenMap[a.id].dismissedAt); })
    .map(function (a) { return { id: a.id, title: a.title, body: a.body, createdAt: a.createdAt, by: userName_(a.createdBy) }; });
  var popup = activeAnns.filter(function (a) { return (a.popup === 'true' || a.popup === '1') && !(seenMap[a.id] && seenMap[a.id].popupSeenAt); })[0];
  base.popupAnnouncement = popup ? { id: popup.id, title: popup.title, body: popup.body, by: userName_(popup.createdBy), createdAt: popup.createdAt } : null;

  base.flags = { announce: has('announce.send'), survey: has('survey.view') || has('survey.send') || has('survey.edit'),
    tools: has('tools.trash') || has('tools.bulk') || has('tools.datacheck') || has('tools.import'), imp: has('tools.import'),
    reset: has('students.reset'), bonus: has('game.bonus') };
  var gcfg = gameCfg_();
  var teachesAny = courses.some(function (c) { return c.teacherId === u.id; });
  base.game = { on: gcfg.on, start: gcfg.start, show: isSuper || has('game.bonus') || teachesAny || u.role === 'teacher', canToggle: isSuper && !readOnly };

  var teaches = u.role === 'teacher' || courses.some(function (c) { return c.teacherId === u.id; });
  base.exam = { all: has('exams.view'), manage: has('exams.manage'), del: has('exams.delete'),
    create: teaches || has('exams.manage'), warnLimit: EXAM_WARN_LIMIT, maxQ: EXAM_MAX_Q, pending: 0 };
  base.exam.show = base.exam.create || base.exam.all;
  if (base.exam.show) { try { base.exam.pending = examPending_(u); } catch (e) { base.exam.pending = 0; } }

  return base;
}

function courseView_(c, rows, u, P, sMap, uMap, withLessons) {
  var N = Number(c.lessonsPerMonth) === 12 ? 12 : 8;
  var m = Number(c.monthNo) || 1;
  var ids = idList_(c.studentIds);
  var cur = rows.filter(function (r) { return Number(r.monthNo) === m; });
  var ev = events_(cur, u, P, sMap, uMap);
  var held = ev.filter(function (e) { return e.held; }).length;
  var per = {};
  ids.forEach(function (id) { per[id] = { held: 0, absent: 0 }; });
  var absent = 0;
  cur.forEach(function (r) {
    if (r.status === ABSENT) absent++;
    if (!per[r.studentId]) return;
    if (r.status === HELD) per[r.studentId].held++; else per[r.studentId].absent++;
  });
  var t = uMap[c.teacherId];
  return {
    id: c.id, title: c.title, type: c.type === 'group' ? 'group' : 'individual',
    teacherId: c.teacherId, teacherName: t ? t.name : '(silinmiş müəllim)',
    studentIds: ids, lessonsPerMonth: N, monthNo: m, monthStart: c.monthStart,
    createdAt: c.createdAt, updatedAt: c.updatedAt,
    held: held, absent: absent, complete: held >= N, perStudent: per,
    lastDate: ev.length ? ev[ev.length - 1].date : '',
    lessons: withLessons ? ev : null,
    isTest: isTrue_(c.isTest)
  };
}

function isTrue_(v) { return v === true || v === 'true' || v === '1' || v === 1; }

function heldSince_(lessons, days) {
  var from = Utilities.formatDate(new Date(Date.now() - days * 864e5), TIMEZONE, 'yyyy-MM-dd');
  var seen = {};
  lessons.forEach(function (l) { if (l.status === HELD && l.date >= from) seen[l.lessonId] = true; });
  return Object.keys(seen).length;
}

function newsSeenAt_(u) { return String(u.newsSeenAt || u.createdAt || ''); }

function events_(rows, u, P, sMap, uMap) {
  var g = {}, order = [];
  rows.forEach(function (r) {
    if (!g[r.lessonId]) {
      g[r.lessonId] = {
        lessonId: r.lessonId, courseId: r.courseId, monthNo: Number(r.monthNo) || 1, date: r.date, topic: r.topic,
        markedBy: r.markedBy, markedByName: uMap[r.markedBy] ? uMap[r.markedBy].name : (r.markedBy ? '(silinmiş istifadəçi)' : '—'),
        markedAt: r.markedAt, editedBy: r.editedBy,
        editedByName: r.editedBy ? (uMap[r.editedBy] ? uMap[r.editedBy].name : '(silinmiş istifadəçi)') : '',
        editedAt: r.editedAt, entries: []
      };
      order.push(r.lessonId);
    }
    g[r.lessonId].entries.push({
      studentId: r.studentId,
      studentName: sMap[r.studentId] ? sMap[r.studentId].name : '(silinmiş tələbə)',
      status: r.status === HELD ? HELD : ABSENT, reason: r.reason
    });
  });
  var list = order.map(function (k) { return g[k]; });
  list.forEach(function (e) { e.held = e.entries.some(function (x) { return x.status === HELD; }); });
  list.sort(function (a, b) {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return a.markedAt < b.markedAt ? -1 : (a.markedAt > b.markedAt ? 1 : 0);
  });
  var cnt = {};
  var ro = u._readOnly;
  list.forEach(function (e) {
    var k = e.courseId + '|' + e.monthNo;
    if (e.held) { cnt[k] = (cnt[k] || 0) + 1; e.no = cnt[k]; } else e.no = null;
    var age = ageHours_(e.markedAt);
    var own = e.markedBy === u.id && age < EDIT_WINDOW_HOURS;
    e.canEdit = !ro && (P.indexOf('attendance.edit') !== -1 || own);
    e.canDelete = !ro && (P.indexOf('attendance.delete') !== -1 || own);
    e.editHoursLeft = e.markedBy === u.id && age < EDIT_WINDOW_HOURS ? Math.max(0, Math.round((EDIT_WINDOW_HOURS - age) * 10) / 10) : null;
  });
  return list;
}

function studentPayload_(req) {
  return {
    name: reqStr_(req.name, 'Ad Soyad', 2, 80),
    parentName: str_(req.parentName, 80),
    note: str_(req.note, 500)
  };
}
function diffText_(oldObj, newObj, labels) {
  var out = [];
  Object.keys(labels).forEach(function (k) {
    if (!(k in newObj)) return;
    var a = String(oldObj[k] || ''), b = String(newObj[k] || '');
    if (a !== b) out.push(labels[k] + ': «' + (a || '—') + '» → «' + (b || '—') + '»');
  });
  return out.join('; ');
}

function dupStudents_(name, exceptId) {
  var fn = fold_(name);
  return rows_('Students').filter(function (s) { return !(exceptId && s.id === exceptId) && fold_(s.name) === fn; });
}

function addStudent_(u, req) {
  need_(u, 'students.add');
  var p = studentPayload_(req);
  if (!req.force) {
    var dups = dupStudents_(p.name, null);
    if (dups.length) {
      throw fail_('Belə tələbə artıq var: ' + dups.map(function (d) { return d.name + (d.login ? ' (' + d.login + ')' : ''); }).join(', ') +
        '. Yenə də əlavə edilsin?', 'DUP');
    }
  }
  var s = { id: newId_('S'), cardToken: newToken_(), status: 'active', createdAt: now_(), updatedAt: '', deletedAt: '', deletedBy: '',
    login: studentLoginFor_(p.name, takenLogins_()), password: makePw_(STUDENT_PASSWORD), mustChange: 'true' };
  Object.keys(p).forEach(function (k) { s[k] = p[k]; });
  insertMany_('Students', [s]);
  log_(u, 'student', 'Tələbə əlavə etdi', s.name + ' · Login: ' + s.login + (s.parentName ? ' · Valideyn: ' + s.parentName : ''));
  return { id: s.id, login: s.login, password: STUDENT_PASSWORD, name: s.name };
}

function editStudent_(u, req) {
  need_(u, 'students.edit');
  var s = mustStudent_(req.id);
  var p = studentPayload_(req);
  var oldName = s.name;
  var diff = diffText_(s, p, STUDENT_FIELDS);
  p.updatedAt = now_();
  update_('Students', s, p);
  log_(u, 'student', 'Tələbəni redaktə etdi', oldName + ' — ' + (diff || 'dəyişiklik edilmədi'));
  return { id: s.id };
}

function deleteStudent_(u, req) {
  need_(u, 'students.delete');
  var s = mustStudent_(req.id);
  var inCourses = rows_('Courses').filter(function (c) { return idList_(c.studentIds).indexOf(s.id) !== -1; });
  if (inCourses.length) {
    throw fail_('Bu tələbə ' + inCourses.length + ' məşğələdə iştirak edir: ' + inCourses.map(courseLabel_).join(', ') +
      '. Əvvəlcə onu məşğələlərdən çıxarın və ya həmin məşğələləri silin.');
  }
  update_('Students', s, { deletedAt: now_(), deletedBy: u.id });
  update_('Students', s, { sessFrom: String(Date.now() + 1) });
  sessDropFor_(s.id);
  log_(u, 'student', 'Tələbəni sildi', s.name + (s.login ? ' · Login: ' + s.login + ' (giriş bağlandı)' : '') + ' · Zibil qutusuna köçürüldü');
  return {};
}

function studentLink_(u, req) {
  var s = mustStudent_(req.id);
  if (!can_(u, 'students.view') && !canResetFor_(u, s.id)) throw fail_('Bu tələbənin linkini almaq üçün icazəniz yoxdur.', 'PERM');
  if (!s.cardToken) { update_('Students', s, { cardToken: newToken_() }); }
  return { token: s.cardToken, name: s.name };
}

function monthlySeries_(history) {
  var by = {};
  history.forEach(function (h) {
    var k = String(h.monthNo || 1);
    if (!by[k]) by[k] = { monthNo: Number(k), held: 0, absent: 0 };
    if (h.status === HELD) by[k].held++; else by[k].absent++;
  });
  return Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return a.monthNo - b.monthNo; });
}

function buildCard_(s, u, forPublic) {
  var P = forPublic ? ALL_PERMS.slice() : permsOf_(u);
  var users = rows_('Users'), students = rows_('Students'), courses = rows_('Courses'), lessons = rows_('Lessons');
  var sMap = {}; students.forEach(function (x) { sMap[x.id] = x; });
  var uMap = {}; users.forEach(function (x) { uMap[x.id] = x; });
  var cMap = {}; courses.forEach(function (c) { cMap[c.id] = c; });
  var viewer = forPublic ? { id: '', role: 'public', _readOnly: true } : u;

  var myCourses = courses.filter(function (c) { return idList_(c.studentIds).indexOf(s.id) !== -1; });
  var touched = {};
  lessons.forEach(function (l) { if (l.studentId === s.id) touched[l.courseId] = true; });
  myCourses.forEach(function (c) { touched[c.id] = true; });
  var byCourse = {};
  lessons.forEach(function (l) { if (touched[l.courseId]) (byCourse[l.courseId] = byCourse[l.courseId] || []).push(l); });

  var history = [];
  Object.keys(byCourse).forEach(function (cid) {
    var c = cMap[cid];
    events_(byCourse[cid], viewer, P, sMap, uMap).forEach(function (e) {
      var mine = e.entries.filter(function (x) { return x.studentId === s.id; })[0];
      if (!mine) return;
      history.push({
        lessonId: e.lessonId, courseId: cid, courseExists: !!c,
        courseTitle: c ? courseLabelFrom_(c, sMap) : '(silinmiş məşğələ)', courseType: c ? c.type : '',
        teacherName: c && uMap[c.teacherId] ? uMap[c.teacherId].name : '—',
        monthNo: e.monthNo, no: e.no, date: e.date, topic: e.topic, status: mine.status, reason: mine.reason,
        markedByName: e.markedByName, markedAt: e.markedAt, editedByName: e.editedByName, editedAt: e.editedAt,
        canEdit: !forPublic && e.canEdit && !!c, canDelete: !forPublic && e.canDelete, groupSize: e.entries.length
      });
    });
  });
  history.sort(function (a, b) {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.markedAt < b.markedAt ? 1 : -1;
  });

  var courseViews = myCourses.map(function (c) {
    var v = courseView_(c, byCourse[c.id] || [], viewer, P, sMap, uMap, false);
    v.mine = v.perStudent[s.id] || { held: 0, absent: 0 };
    v.studentNames = v.studentIds.map(function (id) { return sMap[id] ? sMap[id].name : '(silinmiş tələbə)'; });
    return v;
  });

  return {
    student: forPublic
      ? { name: s.name }
      : { id: s.id, name: s.name, parentName: s.parentName, note: s.note, createdAt: s.createdAt, login: s.login, fresh: isTrue_(s.mustChange), seen: !!s.lastSeen, lastSeen: s.lastSeen,
          status: s.status || 'active', statusAt: s.statusAt || '', statusNote: s.statusNote || '', noRank: isTrue_(s.noRank),
          canStatus: !u._readOnly && can_(u, 'students.edit'), canManage: boss_(u),
          canReset: !u._readOnly && isActiveSt_(s) && canResetFor_(u, s.id), canBonus: !u._readOnly && isActiveSt_(s) && canBonusFor_(u, s.id) },
    courses: courseViews, history: history,
    stats: {
      held: history.filter(function (h) { return h.status === HELD; }).length,
      absent: history.filter(function (h) { return h.status === ABSENT; }).length
    },
    monthly: monthlySeries_(history),
    transfers: forPublic ? [] : transfersOf_(s.id, sMap, uMap),
    exams: examsOfStudent_(s.id, uMap),
    game: forPublic ? publicGame_(s.id) : gameSummary_(s.id)
  };
}

function transfersOf_(studentId, sMap, uMap) {
  var allC = {}; rawRows_('Courses').forEach(function (c) { allC[c.id] = c; });
  var label = function (id) {
    var c = allC[id];
    if (!c) return '(silinmiş məşğələ)';
    return courseLabelFrom_(c, sMap) + (c.deletedAt ? ' (silinib)' : '');
  };
  return rows_('Transfers').filter(function (t) { return t.studentId === studentId; }).map(function (t) {
    return { at: t.at, from: label(t.fromCourseId), to: label(t.toCourseId), by: uMap[t.byUser] ? uMap[t.byUser].name : '—', note: t.note };
  }).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
}

function getStudentCard_(u, req) {
  need_(u, 'students.view');
  var s = mustStudent_(req.id);
  log_(u, 'view', 'Tələbə kartına baxdı', s.name);
  return { card: buildCard_(s, u, false) };
}

function userPayload_(req, isNew, target) {
  var p = {};
  p.name = reqStr_(req.name, 'Ad Soyad', 2, 80);
  p.login = str_(req.login, 30);
  if (!/^[A-Za-z0-9._-]{3,30}$/.test(p.login)) {
    throw fail_('Login 3–30 simvol olmalı və yalnız latın hərfləri, rəqəmlər, nöqtə, alt xətt və ya tire daxil etməlidir.');
  }
  if (isStudentLogin_(p.login) && !(target && lower_(target.login) === lower_(p.login))) throw fail_('«' + STUDENT_PREFIX + '» ilə başlayan loginlər yalnız tələbələr üçündür.');
  if (rawRows_('Students').some(function (x) { return lower_(x.login) === lower_(p.login); })) throw fail_('«' + p.login + '» logini artıq istifadə olunur.');
  var dup = rawRows_('Users').filter(function (x) { return lower_(x.login) === lower_(p.login) && !x.deletedAt && (!target || x.id !== target.id); })[0];
  if (dup) throw fail_('«' + p.login + '» logini artıq istifadə olunur.');
  var pw = String(req.password || '');
  if (isNew || pw) {
    if (pw.length < 4 || pw.length > 50) throw fail_('Şifrə 4–50 simvol olmalıdır.');
    if (/\s/.test(pw)) throw fail_('Şifrədə boşluq olmamalıdır.');
    p.password = pw;
  }
  if (req.subject !== undefined) p.subject = str_(req.subject, 60);
  return p;
}

function addUser_(u, req) {
  need_(u, 'teachers.add');
  var role = req.role === 'helper' ? 'helper' : 'teacher';
  var p = userPayload_(req, true, null);
  var row = { id: newId_('U'), role: role, permissions: '', createdAt: now_(), updatedAt: '', deletedAt: '', deletedBy: '' };
  Object.keys(p).forEach(function (k) { row[k] = p[k]; });
  if (req.mustChange) row.mustChange = 'true';
  insertMany_('Users', [row]);
  log_(u, 'teacher', role === 'helper' ? 'Yeni köməkçi əlavə etdi' : 'Yeni müəllim əlavə etdi',
    row.name + ' · Login: ' + row.login + (row.subject ? ' · Fənn: ' + row.subject : '') + (row.mustChange ? ' · ilk girişdə şifrə dəyişdirilməlidir' : ''));
  return { id: row.id };
}

function editUser_(u, req) {
  var t = mustUser_(req.id);
  if (t.role === 'superadmin' || t.role === 'developer') {
    if (u.id !== t.id) throw fail_('Bu hesabı yalnız özü redaktə edə bilər.', 'PERM');
  } else {
    need_(u, 'teachers.edit');
  }
  var p = userPayload_(req, false, t);
  var newRole = t.role;
  if (t.role === 'teacher' || t.role === 'helper') {
    newRole = req.role === 'helper' ? 'helper' : 'teacher';
    if (newRole === 'helper' && t.role === 'teacher') {
      var cs = rows_('Courses').filter(function (c) { return c.teacherId === t.id; });
      if (cs.length) throw fail_('Bu müəllimin ' + cs.length + ' məşğələsi var. Köməkçi etməzdən əvvəl məşğələləri başqa müəllimə verin.');
    }
  }
  var changes = [];
  var d = diffText_(t, p, { name: 'Ad Soyad', login: 'Login', subject: 'Fənn' });
  if (d) changes.push(d);
  if (newRole !== t.role) changes.push('Rol: «' + ROLE_LABELS[t.role] + '» → «' + ROLE_LABELS[newRole] + '»');
  if (p.password && p.password !== t.password) { changes.push('Şifrə dəyişdirildi'); if (u.id !== t.id) p.sessFrom = String(Date.now() + 1); }

  if (req.mustChange !== undefined && u.id !== t.id && (t.role === 'teacher' || t.role === 'helper')) {
    var mc = req.mustChange ? 'true' : '';
    if (mc !== (isTrue_(t.mustChange) ? 'true' : '')) changes.push(mc ? 'Növbəti girişdə şifrəni dəyişməlidir' : 'Şifrəni dəyişmə tələbi götürüldü');
    p.mustChange = mc;
  }
  var oldName = t.name;
  p.role = newRole;
  p.updatedAt = now_();
  update_('Users', t, p);
  var title = (t.role === 'superadmin' || t.role === 'developer') ? 'Öz profilini redaktə etdi' : (newRole === 'helper' ? 'Köməkçini redaktə etdi' : 'Müəllimi redaktə etdi');
  log_(u, 'teacher', title, oldName + ' — ' + (changes.join('; ') || 'dəyişiklik edilmədi'));
  return { id: t.id };
}

function deleteUser_(u, req) {
  need_(u, 'teachers.delete');
  var t = mustUser_(req.id);
  if (t.role === 'superadmin') throw fail_('Kurs rəhbərinin hesabını silmək olmaz.', 'PERM');
  if (t.role === 'developer') throw fail_('Developer hesabını silmək olmaz.', 'PERM');
  if (t.id === u.id) throw fail_('Öz hesabınızı silə bilməzsiniz.');
  var cs = rows_('Courses').filter(function (c) { return c.teacherId === t.id; });
  if (cs.length) {
    throw fail_('Bu müəllimin ' + cs.length + ' məşğələsi var: ' + cs.map(courseLabel_).join(', ') +
      '. Əvvəlcə «Alətlər»də məşğələləri başqa müəllimə verin və ya silin.');
  }
  update_('Users', t, { deletedAt: now_(), deletedBy: u.id });
  log_(u, 'teacher', t.role === 'helper' ? 'Köməkçini sildi' : 'Müəllimi sildi', t.name + ' · Login: ' + t.login + ' · Zibil qutusuna köçürüldü');
  return {};
}

function revealPassword_(u, req) {
  need_(u, 'teachers.passwords');
  var t = mustUser_(req.id);
  if ((t.role === 'superadmin' || t.role === 'developer') && u.role !== 'superadmin') throw fail_('Bu hesabın şifrəsinə baxmaq olmaz.', 'PERM');
  if (t.role === 'developer') throw fail_('Developer şifrəsinə baxmaq olmaz.', 'PERM');
  log_(u, 'security', 'Şifrəyə baxdı', t.name + ' (' + ROLE_LABELS[t.role] + ')');
  return { password: t.password };
}

function coursePayload_(req) {
  var type = req.type === 'group' ? 'group' : (req.type === 'individual' ? 'individual' : '');
  if (!type) throw fail_('Məşğələnin növünü seçin.');
  var teacher = findUser_(req.teacherId);
  if (!teacher || (teacher.role !== 'teacher' && teacher.role !== 'superadmin')) throw fail_('Müəllim seçin.');
  var ids = (Array.isArray(req.studentIds) ? req.studentIds : []).map(String).filter(function (v, i, a) { return v && a.indexOf(v) === i; });
  ids.forEach(function (id) {
    var x = findStudent_(id);
    if (!x) throw fail_('Seçilmiş tələbələrdən biri tapılmadı. Səhifəni yeniləyin.');
    if (!isActiveSt_(x)) throw fail_(x.name + ' kursu tərk edib. Əvvəlcə tələbə kartında onu yenidən aktiv edin.');
  });
  if (type === 'individual' && ids.length !== 1) throw fail_('Fərdi məşğələ üçün bir tələbə seçin.');
  if (type === 'group' && ids.length < 2) throw fail_('Qrup məşğələsi üçün ən azı iki tələbə seçin.');
  var N = Number(req.lessonsPerMonth);
  if (N !== 8 && N !== 12) throw fail_('Aylıq dərs sayı 8 və ya 12 olmalıdır.');
  return { type: type, title: str_(req.title, 80), teacherId: teacher.id, studentIds: ids.join(','), lessonsPerMonth: String(N) };
}

function addCourse_(u, req) {
  need_(u, 'courses.add');
  var p = coursePayload_(req);
  var c = { id: newId_('C'), monthNo: '1', monthStart: today_(), createdAt: now_(), updatedAt: '', deletedAt: '', deletedBy: '' };
  Object.keys(p).forEach(function (k) { c[k] = p[k]; });
  insertMany_('Courses', [c]);
  log_(u, 'course', TYPE_LABELS[c.type] + ' məşğələ yaratdı',
    '«' + courseLabel_(c) + '» · Müəllim: ' + userName_(c.teacherId) + ' · Tələbə' + (c.type === 'group' ? 'lər' : '') + ': ' +
    idList_(c.studentIds).map(studentName_).join(', ') + ' · Ayda ' + c.lessonsPerMonth + ' dərs');
  if (c.teacherId !== u.id) notify_([c.teacherId], 'course', 'Sizə yeni məşğələ təyin edildi: «' + courseLabel_(c) + '»', 'mine', '');
  return { id: c.id };
}

function editCourse_(u, req) {
  need_(u, 'courses.edit');
  var c = mustCourse_(req.id);
  var p = coursePayload_(req);
  var label = courseLabel_(c);
  var ch = [];
  if (c.type !== p.type) ch.push('Növ: ' + TYPE_LABELS[c.type] + ' → ' + TYPE_LABELS[p.type]);
  if (String(c.title || '') !== p.title) ch.push('Ad: «' + (c.title || '—') + '» → «' + (p.title || '—') + '»');
  var teacherChanged = c.teacherId !== p.teacherId;
  if (teacherChanged) ch.push('Müəllim: ' + userName_(c.teacherId) + ' → ' + userName_(p.teacherId));
  var oldIds = idList_(c.studentIds), newIds = idList_(p.studentIds);
  var added = newIds.filter(function (x) { return oldIds.indexOf(x) === -1; });
  var removed = oldIds.filter(function (x) { return newIds.indexOf(x) === -1; });
  if (added.length) ch.push('Əlavə edilən tələbələr: ' + added.map(studentName_).join(', '));
  if (removed.length) ch.push('Çıxarılan tələbələr: ' + removed.map(studentName_).join(', '));
  if (String(c.lessonsPerMonth) !== p.lessonsPerMonth) ch.push('Aylıq dərs sayı: ' + c.lessonsPerMonth + ' → ' + p.lessonsPerMonth);
  var oldTeacher = c.teacherId;
  p.updatedAt = now_();
  update_('Courses', c, p);
  log_(u, 'course', 'Məşğələni redaktə etdi', '«' + label + '» — ' + (ch.join('; ') || 'dəyişiklik edilmədi'));
  if (teacherChanged) {
    if (p.teacherId !== u.id) notify_([p.teacherId], 'course', 'Sizə yeni məşğələ təyin edildi: «' + courseLabel_(c) + '»', 'mine', '');
    if (oldTeacher && oldTeacher !== u.id) notify_([oldTeacher], 'course', '«' + label + '» məşğələsi başqa müəlliməyə verildi.', 'mine', '');
  }
  return { id: c.id };
}

function deleteCourse_(u, req) {
  need_(u, 'courses.delete');
  var c = mustCourse_(req.id);
  var label = courseLabel_(c);
  update_('Courses', c, { deletedAt: now_(), deletedBy: u.id });
  log_(u, 'course', 'Məşğələni sildi',
    '«' + label + '» (' + TYPE_LABELS[c.type] + ') · Müəllim: ' + userName_(c.teacherId) + ' · Zibil qutusuna köçürüldü');
  if (c.teacherId && c.teacherId !== u.id) notify_([c.teacherId], 'course', '«' + label + '» məşğələsi silindi.', 'mine', '');
  return {};
}

function newMonth_(u, req) {
  need_(u, 'month.new');
  var c = mustCourse_(req.id);
  var m = Number(c.monthNo) || 1;
  var held = heldIn_(c.id, m, null);
  update_('Courses', c, { monthNo: String(m + 1), monthStart: today_(), updatedAt: now_() });
  log_(u, 'month', 'Yeni ay başlatdı', '«' + courseLabel_(c) + '» · Ay ' + m + ' → Ay ' + (m + 1) + ' · Bitən ayda keçirilən dərslər: ' + held + '/' + c.lessonsPerMonth);
  if (c.teacherId && c.teacherId !== u.id) notify_([c.teacherId], 'month', '«' + courseLabel_(c) + '» üçün yeni ay (ay ' + (m + 1) + ') başladıldı.', 'mine', '');
  return {};
}

function transferStudent_(u, req) {
  need_(u, 'tools.bulk');
  var s = mustStudent_(req.studentId);
  var from = mustCourse_(req.fromCourseId);
  var to = mustCourse_(req.toCourseId);
  if (from.id === to.id) throw fail_('Mənbə və hədəf məşğələ eyni ola bilməz.');
  var fromIds = idList_(from.studentIds), toIds = idList_(to.studentIds);
  if (fromIds.indexOf(s.id) === -1) throw fail_('Tələbə mənbə məşğələdə yoxdur.');
  if (toIds.indexOf(s.id) !== -1) throw fail_('Tələbə artıq hədəf məşğələdədir.');
  if (from.type === 'individual') throw fail_('Fərdi məşğələdən köçürmə olmaz. Fərdi məşğələni redaktə edin.');
  if (fromIds.length - 1 < 2) throw fail_('Köçürmədən sonra mənbə qrupda 2-dən az tələbə qalır. Əvvəlcə qrupu redaktə edin və ya bağlayın.');
  if (to.type === 'individual') throw fail_('Fərdi məşğələyə əlavə etmək olmaz.');
  var note = str_(req.note, 200);
  update_('Courses', from, { studentIds: fromIds.filter(function (x) { return x !== s.id; }).join(','), updatedAt: now_() });
  update_('Courses', to, { studentIds: toIds.concat([s.id]).join(','), updatedAt: now_() });
  insertMany_('Transfers', [{ id: newId_('T'), studentId: s.id, fromCourseId: from.id, toCourseId: to.id, byUser: u.id, at: now_(), note: note }]);
  log_(u, 'transfer', 'Tələbəni köçürdü', s.name + ': «' + courseLabel_(from) + '» → «' + courseLabel_(to) + '»' + (note ? ' · ' + note : ''));
  var who = [];
  if (from.teacherId && from.teacherId !== u.id) who.push(from.teacherId);
  if (to.teacherId && to.teacherId !== u.id && to.teacherId !== from.teacherId) who.push(to.teacherId);
  notify_(who, 'transfer', s.name + ' tələbəsi «' + courseLabel_(from) + '» ↔ «' + courseLabel_(to) + '» köçürüldü.', 'mine', '');
  return {};
}

function normEntries_(entries, ids) {
  var map = {};
  (Array.isArray(entries) ? entries : []).forEach(function (e) { if (e && e.studentId) map[String(e.studentId)] = e; });
  Object.keys(map).forEach(function (k) { if (ids.indexOf(k) === -1) throw fail_('Siyahıda məşğələyə aid olmayan tələbə var. Səhifəni yeniləyin.'); });
  return ids.map(function (id) {
    var e = map[id];
    if (!e) throw fail_('Bütün tələbələr üçün qeyd seçin. Səhifəni yeniləyin.');
    var status = e.status === HELD ? HELD : (e.status === ABSENT ? ABSENT : '');
    if (!status) throw fail_('Qeyd növü düzgün deyil.');
    var reason = status === ABSENT ? str_(e.reason, 300) : '';
    if (status === ABSENT && !reason) throw fail_('Qayıb üçün səbəb yazın: ' + studentName_(id) + '.');
    return { studentId: id, status: status, reason: reason };
  });
}
function heldIn_(courseId, monthNo, exceptLessonId) {
  var set = {};
  rows_('Lessons').forEach(function (l) {
    if (l.courseId === courseId && Number(l.monthNo) === Number(monthNo) && l.status === HELD && l.lessonId !== exceptLessonId) set[l.lessonId] = true;
  });
  return Object.keys(set).length;
}
function entriesText_(entries) {
  return entries.map(function (e) { return studentName_(e.studentId) + ': ' + e.status + (e.reason ? ' (' + e.reason + ')' : ''); }).join('; ');
}

function markLesson_(u, req) {
  var c = mustCourse_(req.courseId);
  if (c.teacherId !== u.id && !can_(u, 'attendance.mark')) throw fail_('Bu məşğələdə dərs qeyd etmək üçün icazəniz yoxdur.', 'PERM');
  var date = date_(req.date);
  var topic = str_(req.topic, 200);
  var ids = idList_(c.studentIds);
  if (!ids.length) throw fail_('Məşğələdə tələbə yoxdur.');
  var entries = normEntries_(req.entries, ids);
  var cid = /^[A-Za-z0-9]{8,32}$/.test(String(req.cid || '')) ? String(req.cid) : '';
  if (cid && rows_('Lessons').some(function (l) { return l.lessonId === 'DQ' + cid; })) return { lessonId: 'DQ' + cid, complete: false, dup: true };
  var N = Number(c.lessonsPerMonth) || 8;
  var m = Number(c.monthNo) || 1;
  var held = heldIn_(c.id, m, null);
  if (held >= N) throw fail_('Bu ayın bütün dərsləri (' + N + '/' + N + ') artıq qeyd olunub. Tələbə davam edirsə, yeni ayı başladacaq: ' + OWNER_TITLE + '.');
  var isHeld = entries.some(function (e) { return e.status === HELD; });
  var lessonId = cid ? 'DQ' + cid : newId_('D');
  var stamp = now_();
  insertMany_('Lessons', entries.map(function (e) {
    return { id: newId_('A'), lessonId: lessonId, courseId: c.id, monthNo: String(m), date: date,
      studentId: e.studentId, status: e.status, reason: e.reason, topic: topic, markedBy: u.id, markedAt: stamp, editedBy: '', editedAt: '' };
  }));
  var action = isHeld ? 'Dərsi keçirilmiş kimi qeyd etdi' : 'Dərsi qayıb kimi qeyd etdi';
  var complete = isHeld && held + 1 >= N;
  log_(u, 'lesson', action,
    '«' + courseLabel_(c) + '» · Ay ' + m + ' · Tarix: ' + date + ' · ' + (isHeld ? 'Keçirilən dərslər: ' + (held + 1) + '/' + N : 'Dərs sayına daxil edilmədi') +
    (topic ? ' · Mövzu: ' + topic : '') + (cid ? ' · İnternetsiz qeyd edilib' : '') + ' · ' + entriesText_(entries));
  try { absNotify_(u, c, entries); } catch (e) { console.error(e); }
  if (complete) notify_(adminsFor_('month.new', u.id), 'complete', '«' + courseLabel_(c) + '» məşğələsi ' + N + '/' + N + ' oldu, yeni ayı başlatmaq lazımdır.', 'courses', '');
  return { lessonId: lessonId, complete: complete };
}

function lessonRows_(lessonId) {
  var rows = rows_('Lessons').filter(function (l) { return l.lessonId === String(lessonId); });
  if (!rows.length) throw fail_('Dərs qeydi tapılmadı. Səhifəni yeniləyin.');
  return rows;
}
function canTouchLesson_(u, rows, permKey) {
  if (can_(u, permKey)) return true;
  var r = rows[0];
  return r.markedBy === u.id && ageHours_(r.markedAt) < EDIT_WINDOW_HOURS;
}

function editLesson_(u, req) {
  var rows = lessonRows_(req.lessonId);
  if (!canTouchLesson_(u, rows, 'attendance.edit')) throw fail_('Qeydi düzəltmək üçün vaxt (' + EDIT_WINDOW_HOURS + ' saat) bitib. Düzəliş üçün kurs rəhbərinə müraciət edin (' + OWNER_TITLE + ').', 'PERM');
  var c = findCourse_(rows[0].courseId);
  if (!c) throw fail_('Bu qeydin aid olduğu məşğələ silinib.');
  var ids = rows.map(function (r) { return r.studentId; });
  var date = date_(req.date);
  var topic = str_(req.topic, 200);
  var entries = normEntries_(req.entries, ids);
  var wasHeld = rows.some(function (r) { return r.status === HELD; });
  var isHeld = entries.some(function (e) { return e.status === HELD; });
  var m = Number(rows[0].monthNo) || 1;
  var N = Number(c.lessonsPerMonth) || 8;
  if (isHeld && !wasHeld && heldIn_(c.id, m, rows[0].lessonId) >= N) throw fail_('Bu ayın bütün dərsləri (' + N + '/' + N + ') artıq qeyd olunub. Bu qeydi «keçdi» etmək olmaz.');
  var before = 'Tarix: ' + rows[0].date + (rows[0].topic ? ', Mövzu: ' + rows[0].topic : '') + ', ' +
    entriesText_(rows.map(function (r) { return { studentId: r.studentId, status: r.status, reason: r.reason }; }));
  var stamp = now_();
  var byId = {};
  entries.forEach(function (e) { byId[e.studentId] = e; });
  var markedBy = rows[0].markedBy;
  rows.forEach(function (r) {
    var e = byId[r.studentId];
    update_('Lessons', r, { date: date, topic: topic, status: e.status, reason: e.reason, editedBy: u.id, editedAt: stamp });
  });
  var after = 'Tarix: ' + date + (topic ? ', Mövzu: ' + topic : '') + ', ' + entriesText_(entries);
  log_(u, 'lesson', 'Dərs qeydini düzəltdi', '«' + courseLabel_(c) + '» · Ay ' + m + ' · Əvvəl: [' + before + '] → Sonra: [' + after + ']');
  if (markedBy && markedBy !== u.id) notify_([markedBy], 'lesson', u.name + ' «' + courseLabel_(c) + '» üzrə sizin dərs qeydinizi düzəltdi (' + fmtD_(date) + ').', 'mine', '');
  return {};
}

function deleteLesson_(u, req) {
  var rows = lessonRows_(req.lessonId);
  if (!canTouchLesson_(u, rows, 'attendance.delete')) throw fail_('Qeydi silmək üçün vaxt (' + EDIT_WINDOW_HOURS + ' saat) bitib. Silmək üçün kurs rəhbərinə müraciət edin (' + OWNER_TITLE + ').', 'PERM');
  var c = findCourse_(rows[0].courseId);
  var markedBy = rows[0].markedBy;
  var desc = '«' + courseLabel_(c) + '» · Ay ' + rows[0].monthNo + ' · Tarix: ' + rows[0].date + ' · ' +
    entriesText_(rows.map(function (r) { return { studentId: r.studentId, status: r.status, reason: r.reason }; })) + ' · Qeyd edən: ' + userName_(markedBy);
  removeRows_('Lessons', rows.map(function (r) { return r._row; }));
  log_(u, 'lesson', 'Dərs qeydini sildi', desc);
  if (markedBy && markedBy !== u.id) notify_([markedBy], 'lesson', u.name + ' «' + courseLabel_(c) + '» üzrə sizin dərs qeydinizi sildi (' + fmtD_(rows[0].date) + ').', 'mine', '');
  return {};
}
function fmtD_(s) { return String(s || '').slice(0, 10); }

function getLessons_(u, req) {
  var courseId = str_(req.courseId, 40);
  var own = false;
  if (courseId) { var cc = findCourse_(courseId); own = !!cc && cc.teacherId === u.id; }
  if (!own && !can_(u, 'attendance.view')) throw fail_('Dərs tarixçəsinə baxmaq üçün icazəniz yoxdur.', 'PERM');
  var P = permsOf_(u);
  var users = rows_('Users'), students = rows_('Students'), courses = rows_('Courses');
  var sMap = {}; students.forEach(function (x) { sMap[x.id] = x; });
  var uMap = {}; users.forEach(function (x) { uMap[x.id] = x; });
  var cMap = {}; courses.forEach(function (c) { cMap[c.id] = c; });
  var rows = rows_('Lessons');
  if (courseId) rows = rows.filter(function (l) { return l.courseId === courseId; });
  var list = events_(rows, u, P, sMap, uMap);
  list.forEach(function (e) {
    var c = cMap[e.courseId];
    e.courseExists = !!c;
    e.courseTitle = c ? courseLabelFrom_(c, sMap) : '(silinmiş məşğələ)';
    e.courseType = c ? c.type : '';
    e.teacherName = c && uMap[c.teacherId] ? uMap[c.teacherId].name : '—';
    e.lessonsPerMonth = c ? Number(c.lessonsPerMonth) : null;
    if (!c) e.canEdit = false;
  });
  var from = str_(req.from, 10), to = str_(req.to, 10), status = str_(req.status, 10), q = fold_(str_(req.q, 80));
  list = list.filter(function (e) {
    if (from && e.date < from) return false;
    if (to && e.date > to) return false;
    if (status === HELD && !e.held) return false;
    if (status === ABSENT && !e.entries.some(function (x) { return x.status === ABSENT; })) return false;
    if (q) {
      var hay = fold_([e.courseTitle, e.teacherName, e.markedByName, e.topic].concat(e.entries.map(function (x) { return x.studentName + ' ' + (x.reason || ''); })).join(' '));
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  list.sort(function (a, b) { if (a.date !== b.date) return a.date < b.date ? 1 : -1; return a.markedAt < b.markedAt ? 1 : -1; });
  var offset = Math.max(0, Number(req.offset) || 0);
  var limit = Math.min(200, Math.max(1, Number(req.limit) || 50));
  return { lessons: list.slice(offset, offset + limit), total: list.length };
}

function getLogs_(u, req) {
  need_(u, 'logs.view');
  var type = str_(req.type, 20), userId = str_(req.userId, 40), from = str_(req.from, 10), to = str_(req.to, 10), q = fold_(str_(req.q, 80));
  var since = monthsAgo_(ARCHIVE_MONTHS);
  var list = rows_('Logs').slice().reverse().filter(function (l) {
    if (l.type === 'dev') return false;
    if (type && l.type !== type) return false;
    if (userId && l.userId !== userId) return false;
    var d = String(l.time).slice(0, 10);
    if (d < since) return false;
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (q && fold_(l.userName + ' ' + l.action + ' ' + l.details).indexOf(q) === -1) return false;
    return true;
  });
  var offset = Math.max(0, Number(req.offset) || 0);
  var limit = Math.min(200, Math.max(1, Number(req.limit) || 20));
  return {
    logs: list.slice(offset, offset + limit).map(function (l) {
      return { id: l.id, time: l.time, userId: l.userId, userName: l.userName, role: l.role, type: l.type, action: l.action, details: l.details };
    }),
    total: list.length,
    retentionMonths: ARCHIVE_MONTHS,
    since: since
  };
}

function getDevLog_(u, req) {
  if (u.role !== 'superadmin' && u.role !== 'developer') throw fail_('İcazə yoxdur.', 'PERM');
  var since = monthsAgo_(ARCHIVE_MONTHS);
  var list = rows_('Logs').slice().reverse().filter(function (l) { return l.type === 'dev' && String(l.time).slice(0, 10) >= since; });
  var offset = Math.max(0, Number(req.offset) || 0);
  var limit = Math.min(200, Math.max(1, Number(req.limit) || 20));

  if (u.role === 'superadmin' && req.first) log_(u, 'view', 'Developer fəaliyyətinə baxdı', '');
  return { logs: list.slice(offset, offset + limit).map(function (l) {
    return { id: l.id, time: l.time, userName: l.userName, action: l.action, details: l.details };
  }), total: list.length, retentionMonths: ARCHIVE_MONTHS, since: since };
}

function setPermissions_(u, req) {
  if (!boss_(u)) throw fail_('«İcazələr» bölməsi yalnız rəhbərlik üçündür.', 'PERM');
  var t = mustUser_(req.userId);
  if (t.role === 'superadmin' || t.role === 'developer') throw fail_('Bu hesabın icazələrini dəyişmək olmaz.');
  var wanted = (Array.isArray(req.permissions) ? req.permissions : []).map(String).filter(function (k) { return ALL_PERMS.indexOf(k) !== -1; });
  var next = expandPerms_(wanted);
  var prev = permsOf_(t);
  var added = next.filter(function (k) { return prev.indexOf(k) === -1; });
  var removed = prev.filter(function (k) { return next.indexOf(k) === -1; });
  update_('Users', t, { permissions: next.join(','), updatedAt: now_() });
  added.forEach(function (k) { log_(u, 'permission', 'İcazə verdi', '«' + t.name + '» istifadəçisinə «' + PERM_LABEL[k] + '» icazəsini verdi'); });
  removed.forEach(function (k) { log_(u, 'permission', 'İcazəni geri aldı', '«' + t.name + '» istifadəçisindən «' + PERM_LABEL[k] + '» icazəsini geri aldı'); });
  if (!added.length && !removed.length) log_(u, 'permission', 'İcazələri yadda saxladı', '«' + t.name + '» — dəyişiklik edilmədi');
  if (added.length || removed.length) notify_([t.id], 'perm', 'İcazələriniz yeniləndi (' + OWNER_TITLE + ').', '', '');
  return { added: added.length, removed: removed.length };
}

function markNotif_(u, req) {
  var n = rawRows_('Notifs').filter(function (x) { return x.id === String(req.id) && x.userId === u.id; })[0];
  if (n && !n.readAt) update_('Notifs', n, { readAt: now_() });
  return {};
}
function markAllNotifs_(u, req) {
  rawRows_('Notifs').forEach(function (n) { if (n.userId === u.id && !n.readAt) update_('Notifs', n, { readAt: now_() }); });
  return {};
}

function listAnns_(u, req) {
  need_(u, 'announce.send');
  return { anns: rawRows_('Anns').sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; }).map(function (a) {
    return { id: a.id, title: a.title, body: a.body, popup: a.popup === 'true', active: a.active === 'true', audience: a.audience || 'staff', by: userName_(a.createdBy), createdAt: a.createdAt };
  }) };
}
function saveAnn_(u, req) {
  need_(u, 'announce.send');
  var title = reqStr_(req.title, 'Başlıq', 2, 120);
  var body = reqStr_(req.body, 'Mətn', 2, 2000);
  var popup = req.popup ? 'true' : 'false';
  var active = (req.active === false) ? 'false' : 'true';
  var audience = ['staff', 'students', 'all'].indexOf(req.audience) !== -1 ? req.audience : 'staff';
  var AUD = { staff: 'Müəllimlər', students: 'Tələbələr', all: 'Hamı' };
  if (req.id) {
    var a = rawRows_('Anns').filter(function (x) { return x.id === String(req.id); })[0];
    if (!a) throw fail_('Elan tapılmadı.');
    var wasActive = a.active === 'true', wasPopup = a.popup === 'true';
    update_('Anns', a, { title: title, body: body, popup: popup, active: active, audience: audience, updatedAt: now_() });
    if (active !== 'true') {
      var gone = rawRows_('AnnSeen').filter(function (x) { return x.annId === a.id; });
      if (gone.length) removeRows_('AnnSeen', gone.map(function (x) { return x._row; }));
      log_(u, 'announce', 'Elanı redaktə etdi', '«' + title + '» · söndürülüb');
      return { id: a.id };
    }
    if (!wasActive || (popup === 'true' && !wasPopup)) resetAnnSeen_(a.id, popup === 'true');
    markAuthorSeen_(a.id, u.id);
    log_(u, 'announce', 'Elanı redaktə etdi', '«' + title + '»');
    return { id: a.id };
  }
  var id = newId_('AN');
  insertMany_('Anns', [{ id: id, title: title, body: body, popup: popup, active: active, audience: audience, createdBy: u.id, createdAt: now_(), updatedAt: '' }]);
  if (active === 'true') markAuthorSeen_(id, u.id);
  if (active === 'true' && audience !== 'staff') notify_(rows_('Students').map(function (x) { return x.id; }), 'ann', 'Yeni elan: «' + title + '»', 'sHome', id);
  log_(u, 'announce', 'Elan göndərdi', '«' + title + '» · Kimə: ' + AUD[audience] + (popup === 'true' ? ' · Girişdə pəncərə' : ''));
  return { id: id };
}
function markAuthorSeen_(annId, userId) {
  update_('AnnSeen', annSeenRow_(annId, userId), { dismissedAt: now_(), popupSeenAt: now_() });
}
function resetAnnSeen_(annId, popupToo) {
  rawRows_('AnnSeen').filter(function (x) { return x.annId === annId; }).forEach(function (x) {
    var ch = { dismissedAt: '' };
    if (popupToo) ch.popupSeenAt = '';
    update_('AnnSeen', x, ch);
  });
}
function deleteAnn_(u, req) {
  need_(u, 'announce.send');
  var a = rawRows_('Anns').filter(function (x) { return x.id === String(req.id); })[0];
  if (!a) throw fail_('Elan tapılmadı.');
  removeRows_('Anns', [a._row]);
  var seen = rawRows_('AnnSeen').filter(function (x) { return x.annId === a.id; });
  if (seen.length) removeRows_('AnnSeen', seen.map(function (x) { return x._row; }));
  log_(u, 'announce', 'Elanı sildi', '«' + a.title + '»');
  return {};
}
function annSeenRow_(annId, userId) {
  var r = rawRows_('AnnSeen').filter(function (x) { return x.annId === annId && x.userId === userId; })[0];
  if (!r) { insertMany_('AnnSeen', [{ id: newId_('AS'), annId: annId, userId: userId, dismissedAt: '', popupSeenAt: '' }]);
    r = rawRows_('AnnSeen').filter(function (x) { return x.annId === annId && x.userId === userId; })[0]; }
  return r;
}
function dismissAnn_(u, req) {
  var a = rawRows_('Anns').filter(function (x) { return x.id === String(req.id); })[0];
  if (!a) return {};
  update_('AnnSeen', annSeenRow_(a.id, u.id), { dismissedAt: now_() });
  return {};
}
function seenPopup_(u, req) {
  var a = rawRows_('Anns').filter(function (x) { return x.id === String(req.id); })[0];
  if (!a) return {};
  update_('AnnSeen', annSeenRow_(a.id, u.id), { popupSeenAt: now_() });
  return {};
}

function surveyQuestions_() { return settingGet_('survey') || DEFAULT_SURVEY; }

function getSurveyQuestions_(u, req) {
  if (!can_(u, 'survey.edit') && !can_(u, 'survey.view') && !can_(u, 'survey.send')) throw fail_('İcazə yoxdur.', 'PERM');
  return { survey: surveyQuestions_(), canEdit: can_(u, 'survey.edit') };
}
function saveSurveyQuestions_(u, req) {
  need_(u, 'survey.edit');
  var cur = surveyQuestions_();
  var intro = str_(req.intro, 600) || cur.intro;
  var inQ = Array.isArray(req.questions) ? req.questions : [];
  var qs = [];
  inQ.forEach(function (q, i) {
    var text = str_(q.text, 300);
    if (!text) return;
    var type = ['scale5', 'choice', 'nps', 'text'].indexOf(q.type) !== -1 ? q.type : 'scale5';
    var o = { id: 'q' + (i + 1), type: type, text: text };
    if (type === 'choice') {
      var opts = (Array.isArray(q.options) ? q.options : []).map(function (x) { return str_(x, 60); }).filter(String);
      if (opts.length < 2) throw fail_('«' + text + '» sualı üçün ən azı 2 variant yazın.');
      o.options = opts;
      if (Array.isArray(q.bad)) o.bad = q.bad.map(function (x) { return str_(x, 60); }).filter(function (x) { return opts.indexOf(x) !== -1; });
    }
    if (q.teacher) o.teacher = true;
    if (q.optional || type === 'text') o.optional = true;
    qs.push(o);
  });
  if (!qs.length) throw fail_('Ən azı bir sual olmalıdır.');
  var next = { version: (Number(cur.version) || 1) + 1, intro: intro, questions: qs };
  settingSet_('survey', next);
  log_(u, 'survey', 'Sorğu suallarını dəyişdi', qs.length + ' sual · versiya ' + next.version);
  return { survey: next };
}

function surveyTargets_(u, req) {
  need_(u, 'survey.send');
  var mk = monthKey_();
  var surveys = rawRows_('Surveys');
  var byStudent = {};
  surveys.forEach(function (sv) {
    var key = sv.studentId;
    if (!byStudent[key]) byStudent[key] = [];
    byStudent[key].push(sv);
  });
  var courses = rows_('Courses');
  var out = rows_('Students').map(function (s) {
    var cs = courses.filter(function (c) { return idList_(c.studentIds).indexOf(s.id) !== -1; });
    var mine = (byStudent[s.id] || []).filter(function (sv) { return String(sv.sentAt).slice(0, 7) === mk; });
    var answered = mine.some(function (sv) { return sv.status === 'answered'; });
    var sent = mine.length > 0;
    return {
      id: s.id, name: s.name,
      courses: cs.map(function (c) { return { id: c.id, title: courseLabel_(c), teacherId: c.teacherId, teacherName: userName_(c.teacherId) }; }),
      status: answered ? 'answered' : (sent ? 'sent' : 'none')
    };
  }).sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  return { targets: out, monthKey: mk };
}

function sendSurvey_(u, req) {
  need_(u, 'survey.send');
  var s = mustStudent_(req.studentId);
  var cs = rows_('Courses').filter(function (c) { return idList_(c.studentIds).indexOf(s.id) !== -1; });
  if (!cs.length) throw fail_('Bu tələbə heç bir məşğələdə yoxdur.');
  var course = req.courseId ? cs.filter(function (c) { return c.id === String(req.courseId); })[0] : cs[0];
  if (!course) throw fail_('Məşğələ tapılmadı.');
  var mk = monthKey_();

  var existing = rawRows_('Surveys').filter(function (sv) {
    return sv.studentId === s.id && String(sv.sentAt).slice(0, 7) === mk;
  });
  var answered = existing.filter(function (sv) { return sv.status === 'answered'; })[0];
  if (answered) throw fail_('Bu tələbə bu ay sorğunu artıq cavablandırıb.');
  var open = existing.filter(function (sv) { return sv.status === 'sent' && sv.courseId === course.id; })[0];
  var survey = surveyQuestions_();
  if (open) {
    log_(u, 'survey', 'Sorğu linkini yenidən götürdü', s.name);
    return link_(open, s, course);
  }
  var row = {
    id: newId_('SV'), token: newToken_(), studentId: s.id, courseId: course.id, teacherId: course.teacherId,
    monthNo: String(course.monthNo || 1), status: 'sent', qVersion: String(survey.version),
    questions: JSON.stringify(survey.questions), answers: '', sentBy: u.id, sentAt: now_(), answeredAt: '',
    adminStatus: '', adminNote: '', lowFlag: ''
  };
  insertMany_('Surveys', [row]);
  log_(u, 'survey', 'Sorğu linki göndərdi', s.name + ' · Müəllim: ' + userName_(course.teacherId) + ' · «' + courseLabel_(course) + '»');
  return link_(row, s, course);
}
function link_(sv, s, course) {
  return { token: sv.token, studentName: s.name, teacherName: userName_(course.teacherId), courseTitle: courseLabel_(course) };
}

function surveyResponses_(u, req) {
  need_(u, 'survey.view');
  var users = rows_('Users'), courses = rawRows_('Courses');
  var uMap = {}; users.forEach(function (x) { uMap[x.id] = x; });
  var cMap = {}; courses.forEach(function (c) { cMap[c.id] = c; });
  var all = rawRows_('Surveys').filter(function (sv) { return sv.status === 'answered'; });
  var teacherId = str_(req.teacherId, 40), monthK = str_(req.month, 7), low = !!req.low, onlyNew = !!req.onlyNew;
  var list = all.map(function (sv) {
    var ans = []; try { ans = JSON.parse(sv.answers || '[]'); } catch (e) {}
    var qs = []; try { qs = JSON.parse(sv.questions || '[]'); } catch (e) {}
    return {
      id: sv.id, studentName: studentName_(sv.studentId), teacherId: sv.teacherId, teacherName: uMap[sv.teacherId] ? uMap[sv.teacherId].name : '(silinmiş)',
      courseTitle: cMap[sv.courseId] ? courseLabel_(cMap[sv.courseId]) : '(silinmiş məşğələ)',
      monthKey: String(sv.answeredAt).slice(0, 7), answeredAt: sv.answeredAt,
      answers: qs.map(function (q) { var a = ans.filter(function (x) { return x.id === q.id; })[0]; return { q: q.text, type: q.type, value: a ? a.value : '' }; }),
      low: sv.lowFlag === 'true', adminStatus: sv.adminStatus || 'new', adminNote: sv.adminNote || '',
      teacherScore: teacherScore_(qs, ans)
    };
  });
  var filtered = list.filter(function (r) {
    if (teacherId && r.teacherId !== teacherId) return false;
    if (monthK && r.monthKey !== monthK) return false;
    if (low && !r.low) return false;
    if (onlyNew && r.adminStatus !== 'new') return false;
    return true;
  }).sort(function (a, b) { return a.answeredAt < b.answeredAt ? 1 : -1; });

  var byTeacher = {};
  list.forEach(function (r) {
    if (r.teacherScore == null) return;
    var k = r.teacherId;
    if (!byTeacher[k]) byTeacher[k] = { teacherId: k, teacherName: r.teacherName, sum: 0, n: 0, low: 0, total: 0 };
    byTeacher[k].sum += r.teacherScore; byTeacher[k].n++;
  });
  list.forEach(function (r) { var k = r.teacherId; if (byTeacher[k]) { byTeacher[k].total++; if (r.low) byTeacher[k].low++; } });
  var summary = Object.keys(byTeacher).map(function (k) {
    var t = byTeacher[k];
    return { teacherId: k, teacherName: t.teacherName, avg: t.n ? Math.round(t.sum / t.n * 10) / 10 : null, responses: t.total, low: t.low };
  }).sort(function (a, b) { return (b.avg || 0) - (a.avg || 0); });

  var months = {}; list.forEach(function (r) { months[r.monthKey] = (months[r.monthKey] || 0) + 1; });
  var monthList = Object.keys(months).sort().reverse();
  var teachers = {}; list.forEach(function (r) { teachers[r.teacherId] = r.teacherName; });

  return {
    responses: filtered, summary: summary, total: all.length, shown: filtered.length,
    months: monthList, teachers: Object.keys(teachers).map(function (k) { return { id: k, name: teachers[k] }; })
  };
}
function teacherScore_(qs, ans) {
  var sum = 0, n = 0;
  qs.forEach(function (q) {
    if (q.type === 'scale5' && q.teacher) {
      var a = ans.filter(function (x) { return x.id === q.id; })[0];
      if (a && Number(a.value) >= 1) { sum += Number(a.value); n++; }
    }
  });
  return n ? Math.round(sum / n * 10) / 10 : null;
}
function setSurveyStatus_(u, req) {
  need_(u, 'survey.view');
  var sv = rawRows_('Surveys').filter(function (x) { return x.id === String(req.id); })[0];
  if (!sv) throw fail_('Cavab tapılmadı.');
  var st = ['new', 'reviewed', 'contacted'].indexOf(req.status) !== -1 ? req.status : sv.adminStatus;
  var note = str_(req.note, 500);
  update_('Surveys', sv, { adminStatus: st, adminNote: note });
  var lbl = { new: 'Yeni', reviewed: 'Baxıldı', contacted: 'Valideynlə əlaqə saxlanıldı' };
  log_(u, 'survey', 'Sorğu cavabının statusunu dəyişdi', studentName_(sv.studentId) + ' → ' + (lbl[st] || st) + (note ? ' · ' + note : ''));
  return {};
}

function publicSurveyInfo_(req) {
  var sv = rawRows_('Surveys').filter(function (x) { return x.token === String(req.token || ''); })[0];
  if (!sv) throw fail_('Sorğu tapılmadı. Link yanlışdır.', 'NOTFOUND');
  if (sv.status === 'answered') return { state: 'answered' };
  if (ageHours_(sv.sentAt) > SURVEY_TTL_DAYS * 24) return { state: 'expired' };
  var qs = []; try { qs = JSON.parse(sv.questions || '[]'); } catch (e) {}
  var survey = surveyQuestions_();
  var course = findCourse_(sv.courseId);
  return {
    state: 'open',
    studentName: studentName_(sv.studentId),
    teacherName: userName_(sv.teacherId),
    courseTitle: course ? courseLabel_(course) : '',
    intro: survey.intro || DEFAULT_SURVEY.intro,
    questions: qs
  };
}
function submitSurvey_(req) {
  var sv = rawRows_('Surveys').filter(function (x) { return x.token === String(req.token || ''); })[0];
  if (!sv) throw fail_('Sorğu tapılmadı. Link yanlışdır.', 'NOTFOUND');
  if (sv.status === 'answered') return { state: 'answered' };
  if (ageHours_(sv.sentAt) > SURVEY_TTL_DAYS * 24) return { state: 'expired' };
  var qs = []; try { qs = JSON.parse(sv.questions || '[]'); } catch (e) {}
  var inAns = {};
  (Array.isArray(req.answers) ? req.answers : []).forEach(function (a) { if (a && a.id) inAns[a.id] = a.value; });
  var out = [], low = false;
  qs.forEach(function (q) {
    var v = inAns[q.id];
    if (q.type === 'scale5') {
      var n = Number(v);
      if (!(n >= 1 && n <= 5)) throw fail_('Bütün suallara cavab verin.');
      if (n <= 2) low = true;
      out.push({ id: q.id, value: n });
    } else if (q.type === 'nps') {
      var m = Number(v);
      if (!(m >= 0 && m <= 10)) throw fail_('Bütün suallara cavab verin.');
      if (m <= 6) low = true;
      out.push({ id: q.id, value: m });
    } else if (q.type === 'choice') {
      if ((q.options || []).indexOf(v) === -1) throw fail_('Bütün suallara cavab verin.');
      if ((q.bad || []).indexOf(v) !== -1) low = true;
      out.push({ id: q.id, value: v });
    } else {
      out.push({ id: q.id, value: str_(v, 1000) });
    }
  });
  update_('Surveys', sv, { status: 'answered', answers: JSON.stringify(out), answeredAt: now_(), lowFlag: low ? 'true' : 'false', adminStatus: 'new' });
  notify_(adminsFor_('survey.view', ''), 'survey', 'Yeni sorğu cavabı: ' + studentName_(sv.studentId) + (low ? ' (aşağı qiymət!)' : ''), 'tools', 'surveys');
  return { state: 'done' };
}

function publicCard_(req) {
  var s = rows_('Students').filter(function (x) { return x.cardToken && x.cardToken === String(req.token || ''); })[0];
  if (!s) throw fail_('Tələbə tapılmadı. Link yanlışdır.', 'NOTFOUND');
  return { card: buildCard_(s, null, true) };
}

function trashList_(u, req) {
  need_(u, 'tools.trash');
  var purgeHint = TRASH_DAYS;
  var out = { students: [], users: [], courses: [], exams: [], purgeDays: purgeHint };
  var resCount = {};
  if (trashRows_('Exams').length) examIndex_().forEach(function (x) { resCount[x.examId] = (resCount[x.examId] || 0) + 1; });
  trashRows_('Exams').forEach(function (e) {
    out.exams.push({ id: e.id, title: e.title, teacherName: userName_(e.teacherId), attempts: resCount[e.id] || 0,
      deletedAt: e.deletedAt, deletedBy: userName_(e.deletedBy), daysLeft: daysLeft_(e.deletedAt) });
  });
  trashRows_('Students').forEach(function (s) {
    out.students.push({ id: s.id, name: s.name, login: s.login, deletedAt: s.deletedAt, deletedBy: userName_(s.deletedBy), daysLeft: daysLeft_(s.deletedAt) });
  });
  trashRows_('Users').forEach(function (x) {
    out.users.push({ id: x.id, name: x.name, login: x.login, role: x.role, deletedAt: x.deletedAt, deletedBy: userName_(x.deletedBy), daysLeft: daysLeft_(x.deletedAt) });
  });
  trashRows_('Courses').forEach(function (c) {
    out.courses.push({ id: c.id, title: courseLabel_(c), type: c.type, teacherName: userName_(c.teacherId), deletedAt: c.deletedAt, deletedBy: userName_(c.deletedBy), daysLeft: daysLeft_(c.deletedAt) });
  });
  return out;
}
function daysLeft_(deletedAt) { return Math.max(0, Math.ceil(TRASH_DAYS - ageHours_(deletedAt) / 24)); }

function restoreItem_(u, req) {
  need_(u, 'tools.trash');
  var kind = req.kind, sheet = { student: 'Students', user: 'Users', course: 'Courses', exam: 'Exams' }[kind];
  if (!sheet) throw fail_('Naməlum element.');
  var r = trashRows_(sheet).filter(function (x) { return x.id === String(req.id); })[0];
  if (!r) throw fail_('Element tapılmadı.');
  if (sheet === 'Users') {
    var dup = rows_('Users').filter(function (x) { return lower_(x.login) === lower_(r.login); })[0];
    if (dup) throw fail_('«' + r.login + '» logini artıq istifadə olunur. Bərpadan əvvəl digərini dəyişin.');
  }
  update_(sheet, r, { deletedAt: '', deletedBy: '' });
  var nm = sheet === 'Courses' ? courseLabel_(r) : (sheet === 'Exams' ? r.title : r.name);
  log_(u, 'trash', 'Zibildən bərpa etdi', TRASH_KIND[kind] + ': ' + nm);
  return {};
}
var TRASH_KIND = { student: 'Tələbə', user: 'İstifadəçi', course: 'Məşğələ', exam: 'İmtahan' };
function purgeItem_(u, req) {
  need_(u, 'tools.trash');
  var kind = req.kind, sheet = { student: 'Students', user: 'Users', course: 'Courses', exam: 'Exams' }[kind];
  if (!sheet) throw fail_('Naməlum element.');
  var r = trashRows_(sheet).filter(function (x) { return x.id === String(req.id); })[0];
  if (!r) throw fail_('Element tapılmadı.');
  var nm = sheet === 'Courses' ? courseLabel_(r) : (sheet === 'Exams' ? r.title : r.name);
  var extra = '';
  if (sheet === 'Courses') {
    var lr = rows_('Lessons').filter(function (l) { return l.courseId === r.id; });
    if (lr.length) removeRows_('Lessons', lr.map(function (l) { return l._row; }));
  }
  if (sheet === 'Exams') {
    need_(u, 'exams.delete');
    var gone = examPurgeResults_([r.id]);
    extra = ' · ' + gone + ' nəticə ilə birlikdə';
    r = trashRows_('Exams').filter(function (x) { return x.id === String(req.id); })[0];
  }
  removeRows_(sheet, [r._row]);
  log_(u, 'trash', 'Həmişəlik sildi', TRASH_KIND[kind] + ': ' + nm + extra);
  return {};
}

function teacherLeave_(u, req) {
  need_(u, 'tools.bulk');
  var t = mustUser_(req.teacherId);
  var to = mustUser_(req.toTeacherId);
  if (t.id === to.id) throw fail_('Eyni müəllim seçildi.');
  if (to.role !== 'teacher' && to.role !== 'superadmin') throw fail_('Hədəf müəllim düzgün deyil.');
  var cs = rows_('Courses').filter(function (c) { return c.teacherId === t.id; });
  if (!cs.length) throw fail_('Bu müəllimin məşğələsi yoxdur.');
  cs.forEach(function (c) { update_('Courses', c, { teacherId: to.id, updatedAt: now_() }); });
  log_(u, 'course', 'Müəllimin məşğələlərini köçürdü', cs.length + ' məşğələ: ' + t.name + ' → ' + to.name);
  if (to.id !== u.id) notify_([to.id], 'course', cs.length + ' məşğələ sizə köçürüldü (əvvəlki müəllim: ' + t.name + ').', 'mine', '');
  return { moved: cs.length };
}

function moveStudents_(u, req) {
  need_(u, 'tools.bulk');
  var from = mustCourse_(req.fromCourseId);
  var to = mustCourse_(req.toCourseId);
  if (from.id === to.id) throw fail_('Mənbə və hədəf eyni ola bilməz.');
  if (to.type === 'individual') throw fail_('Fərdi məşğələyə köçürmək olmaz.');
  var ids = (Array.isArray(req.studentIds) ? req.studentIds : []).map(String);
  var fromIds = idList_(from.studentIds);
  ids = ids.filter(function (id) { return fromIds.indexOf(id) !== -1; });
  if (!ids.length) throw fail_('Köçürüləcək tələbə seçilməyib.');
  if (from.type === 'group' && fromIds.length - ids.length < 2 && fromIds.length - ids.length > 0) throw fail_('Köçürmədən sonra mənbə qrupda 2-dən az tələbə qalır.');
  var toIds = idList_(to.studentIds);
  ids.forEach(function (id) { if (toIds.indexOf(id) === -1) toIds.push(id); });
  update_('Courses', from, { studentIds: fromIds.filter(function (x) { return ids.indexOf(x) === -1; }).join(','), updatedAt: now_() });
  update_('Courses', to, { studentIds: toIds.join(','), updatedAt: now_() });
  ids.forEach(function (id) { insertMany_('Transfers', [{ id: newId_('T'), studentId: id, fromCourseId: from.id, toCourseId: to.id, byUser: u.id, at: now_(), note: 'Toplu köçürmə' }]); });
  log_(u, 'transfer', 'Tələbələri köçürdü', ids.length + ' tələbə: «' + courseLabel_(from) + '» → «' + courseLabel_(to) + '»');
  return { moved: ids.length };
}

function dataCheck_(u, req) {
  need_(u, 'tools.datacheck');
  var issues = [];
  var students = rows_('Students'), courses = rows_('Courses'), lessons = rows_('Lessons');
  var sIds = {}; students.forEach(function (s) { sIds[s.id] = true; });
  var cIds = {}; courses.forEach(function (c) { cIds[c.id] = true; });

  var byName = {};
  students.forEach(function (s) { var k = fold_(s.name); (byName[k] = byName[k] || []).push(s.name); });
  Object.keys(byName).forEach(function (k) { if (byName[k].length > 1) issues.push({ type: 'warn', text: 'Eyni adlı tələbələr: ' + byName[k].join(', ') }); });
  var byLogin = {};
  rawRows_('Students').forEach(function (s) { if (s.login) (byLogin[lower_(s.login)] = byLogin[lower_(s.login)] || []).push(s.name); });
  rawRows_('Users').forEach(function (x) { if (x.login && byLogin[lower_(x.login)]) byLogin[lower_(x.login)].push(x.name); });
  Object.keys(byLogin).forEach(function (k) { if (byLogin[k].length > 1) issues.push({ type: 'err', text: 'Eyni login (' + k + '): ' + byLogin[k].join(', ') + '. Birinin şifrəsini sıfırlayın, sistem ona yeni login verəcək.' }); });
  var noLogin = students.filter(function (s) { return !s.login; });
  if (noLogin.length) issues.push({ type: 'err', text: noLogin.length + ' tələbənin logini yoxdur: ' + noLogin.slice(0, 10).map(function (s) { return s.name; }).join(', ') + '. Developer setup()-ı yenidən işə salmalıdır.' });
  var never = students.filter(function (s) { return isActiveSt_(s) && s.login && !s.lastSeen; });
  if (never.length) issues.push({ type: 'info', text: never.length + ' tələbə hələ kabinetə daxil olmayıb: ' + never.slice(0, 12).map(function (s) { return s.name; }).join(', ') + (never.length > 12 ? ' və s.' : '') });

  courses.forEach(function (c) {
    var ids = idList_(c.studentIds).filter(function (id) { return sIds[id]; });
    if (ids.length === 0) issues.push({ type: 'err', text: '«' + courseLabel_(c) + '» məşğələsində tələbə yoxdur.' });
    else if (c.type === 'group' && ids.length < 2) issues.push({ type: 'warn', text: '«' + courseLabel_(c) + '» qrupunda cəmi 1 tələbə var.' });
    var missing = idList_(c.studentIds).filter(function (id) { return !sIds[id]; });
    if (missing.length) issues.push({ type: 'err', text: '«' + courseLabel_(c) + '» məşğələsində silinmiş tələbəyə istinad var (' + missing.length + ').' });

    var m = Number(c.monthNo) || 1, N = Number(c.lessonsPerMonth) || 8;
    if (heldIn_(c.id, m, null) > N) issues.push({ type: 'err', text: '«' + courseLabel_(c) + '»: cari ayda keçirilən dərs sayı normadan (' + N + ') çoxdur.' });
  });

  var lessonOrphan = 0, lessonSet = {};
  lessons.forEach(function (l) { if (!cIds[l.courseId]) lessonSet[l.courseId] = true; });
  lessonOrphan = Object.keys(lessonSet).length;
  if (lessonOrphan) issues.push({ type: 'info', text: lessonOrphan + ' məşğələyə aid dərs qeydləri var, lakin məşğələ artıq aktiv deyil (silinib).' });
  examCheck_(issues, sIds);
  var tc = testCounts_(testScope_());
  if (tc.teachers || tc.students || tc.courses) issues.push({ type: 'info', text: 'Sistemdə test məlumatları var: ' + tc.teachers + ' müəllim, ' + tc.students + ' tələbə, ' + tc.courses + ' məşğələ. Developer onları bir düymə ilə silə bilər.' });

  log_(u, 'tools', 'Məlumatları yoxladı', 'Tapılan problem sayı: ' + issues.length);
  return { issues: issues, counts: { students: students.length, courses: courses.length, lessons: lessons.length, logins: students.filter(function (s) { return s.login; }).length } };
}

function listChangelog_(u, req) {
  return { items: rawRows_('Changelog').sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; }).map(function (c) {
    return { id: c.id, title: c.title, body: c.body, kind: c.kind || 'update', createdAt: c.createdAt, by: userName_(c.createdBy) };
  }), canEdit: u.role === 'developer' };
}
function addChangelog_(u, req) {
  if (u.role !== 'developer') throw fail_('Yalnız developer yenilik əlavə edə bilər.', 'PERM');
  var title = reqStr_(req.title, 'Başlıq', 2, 160);
  var body = str_(req.body, 3000);
  var kind = ['update', 'fix', 'new'].indexOf(req.kind) !== -1 ? req.kind : 'update';
  if (req.id) {
    var c = rawRows_('Changelog').filter(function (x) { return x.id === String(req.id); })[0];
    if (!c) throw fail_('Qeyd tapılmadı.');
    var was = c.title;
    update_('Changelog', c, { title: title, body: body, kind: kind });
    log_(u, 'dev', 'Yeniliyi redaktə etdi', was === title ? title : '«' + was + '» → «' + title + '»');
    return { id: c.id };
  }
  var id = newId_('CL');
  insertMany_('Changelog', [{ id: id, title: title, body: body, kind: kind, createdBy: u.id, createdAt: now_() }]);
  log_(u, 'dev', 'Yenilik əlavə etdi', title);
  return { id: id };
}
function deleteChangelog_(u, req) {
  if (u.role !== 'developer') throw fail_('İcazə yoxdur.', 'PERM');
  var c = rawRows_('Changelog').filter(function (x) { return x.id === String(req.id); })[0];
  if (!c) throw fail_('Qeyd tapılmadı.');
  removeRows_('Changelog', [c._row]);
  log_(u, 'dev', 'Yeniliyi sildi', c.title);
  return {};
}

function markNewsSeen_(u, req) {
  if (u.role === 'developer') return { unread: 0 };
  var seen = newsSeenAt_(u);
  var fresh = rawRows_('Changelog').filter(function (c) { return c.createdAt > seen; });
  if (!fresh.length) return { unread: 0 };
  update_('Users', u, { newsSeenAt: now_() });
  log_(u, 'view', 'Yenilikləri oxudu', fresh.length + ' yeni qeyd: ' + fresh.map(function (c) { return c.title; }).slice(0, 5).join('; '));
  return { unread: 0 };
}

function setMaintenance_(u, req) {
  if (u.role !== 'developer') throw fail_('Yalnız developer texniki rejimi idarə edə bilər.', 'PERM');
  var on = !!req.on;
  var text = on ? str_(req.text, 300) : '';
  var minutes = on ? Number(req.minutes) || 0 : 0;
  if ([0, 15, 30, 60, 120, 240].indexOf(minutes) === -1) minutes = 0;
  var until = minutes ? Utilities.formatDate(new Date(Date.now() + minutes * 60000), TIMEZONE, 'yyyy-MM-dd HH:mm:ss') : '';
  settingSet_('maintenance', { on: on, text: text, until: until, by: u.name, at: now_() });
  log_(u, 'dev', on ? 'Texniki rejimi açdı' : 'Texniki rejimi bağladı',
    on ? ((minutes ? 'Təxmini müddət: ' + minutes + ' dəq' : 'Müddət göstərilməyib') + (text ? ' · Qeyd: ' + text : '')) : '');
  return { maintenance: maint_() };
}
function devStats_(u, req) {
  if (u.role !== 'developer' && u.role !== 'superadmin') throw fail_('İcazə yoxdur.', 'PERM');
  var sheets = {};
  Object.keys(SCHEMA).forEach(function (name) { sheets[name] = rawRows_(name).length; });
  var surveys = rawRows_('Surveys');
  return {
    sheets: sheets,
    students: rows_('Students').length, trashStudents: trashRows_('Students').length,
    courses: rows_('Courses').length, users: rows_('Users').length,
    lessons: rawRows_('Lessons').length, surveysSent: surveys.length, surveysAnswered: surveys.filter(function (s) { return s.status === 'answered'; }).length,
    surveyVersion: surveyQuestions_().version, now: now_(), sessions: sessStats_()
  };
}

var TEST_NAMES_F = ['Aysel', 'Nigar', 'Leyla', 'Günay', 'Səbinə', 'Nərmin', 'Aynur', 'Fidan', 'Zəhra', 'Lalə', 'Aytac', 'Könül'];
var TEST_NAMES_M = ['Kamran', 'Tural', 'Orxan', 'Elvin', 'Rauf', 'Murad', 'Fərid', 'Nicat', 'Ülvi', 'Rəşad', 'Samir', 'Emil'];
var TEST_SURNAMES = ['Əliyev', 'Məmmədov', 'Həsənov', 'Hüseynov', 'Quliyev', 'Cəfərov', 'Kərimov', 'İsmayılov', 'Rəhimov', 'Abbasov', 'Nəsirov', 'Babayev'];
var TEST_SUBJECTS = ['İngilis dili', 'Rus dili', 'Riyaziyyat', 'Alman dili', 'Fizika', 'Kimya'];
var TEST_TOPICS = ['Present Simple', 'Past Simple', 'Lüğət: ailə', 'Oxu tapşırığı', 'Danışıq praktikası', 'Test işi', 'Dinləmə', 'Qrammatika təkrarı', ''];
var TEST_REASONS = ['Xəstə idi', 'Ailə səbəbi', 'Səfərdə idi', 'Xəbər vermədi'];
var TEST_PASSWORD = 'test1234';
var TEST_BONUS = ['Fəal iştirak', 'Ev tapşırığı əla idi', 'Yoldaşına kömək etdi', 'Böyük irəliləyiş'];

function needDev_(u) { if (u.role !== 'developer') throw fail_('Bu əməliyyat yalnız developer üçündür.', 'PERM'); }
function pick_(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function daysAgo_(n) { return Utilities.formatDate(new Date(Date.now() - n * 864e5), TIMEZONE, 'yyyy-MM-dd'); }
function testPerson_() {
  var female = Math.random() < 0.5;
  var sur = pick_(TEST_SURNAMES);
  return 'Test ' + (female ? pick_(TEST_NAMES_F) : pick_(TEST_NAMES_M)) + ' ' + (female ? sur + 'a' : sur);
}

function testScope_() {
  var tU = {}, tS = {}, tC = {};
  rawRows_('Users').forEach(function (x) { if (isTrue_(x.isTest)) tU[x.id] = x; });
  rawRows_('Students').forEach(function (x) { if (isTrue_(x.isTest)) tS[x.id] = x; });
  rawRows_('Courses').forEach(function (x) { if (isTrue_(x.isTest)) tC[x.id] = x; });
  var lessons = rawRows_('Lessons').filter(function (l) { return tC[l.courseId] || tS[l.studentId]; });
  var bonuses = rawRows_('Bonuses').filter(function (b) { return tS[b.studentId] || tU[b.givenBy]; });
  var badges = rawRows_('Badges').filter(function (b) { return tS[b.studentId]; });
  var ratings = rawRows_('Ratings').filter(function (r) { return tS[r.refId] || tC[r.refId]; });
  var sessions = rawRows_('Sessions').filter(function (x) { return tS[x.userId] || tU[x.userId]; });
  var transfers = rawRows_('Transfers').filter(function (t) { return tS[t.studentId] || tC[t.fromCourseId] || tC[t.toCourseId]; });
  var surveys = rawRows_('Surveys').filter(function (s) { return tS[s.studentId] || tC[s.courseId] || tU[s.teacherId]; });
  var notifs = rawRows_('Notifs').filter(function (n) { return tU[n.userId] || tS[n.userId]; });
  var annSeen = rawRows_('AnnSeen').filter(function (n) { return tU[n.userId] || tS[n.userId]; });

  var tE = {};
  rawRows_('Exams').forEach(function (x) { if (isTrue_(x.isTest) || tU[x.teacherId]) tE[x.id] = x; });
  var examRes = examIndex_().filter(function (a) { return tE[a.examId] || tS[a.studentId]; });
  var realExams = rawRows_('Exams').filter(function (e) { return !tE[e.id] && idList_(e.studentIds).some(function (id) { return tS[id]; }); });

  var conflicts = rows_('Courses').filter(function (c) { return !tC[c.id] && tU[c.teacherId]; });
  var realWithTestStudents = rawRows_('Courses').filter(function (c) {
    return !tC[c.id] && idList_(c.studentIds).some(function (id) { return tS[id]; });
  });
  return { tU: tU, tS: tS, tC: tC, tE: tE, examRes: examRes, realExams: realExams, lessons: lessons, bonuses: bonuses, badges: badges, ratings: ratings, sessions: sessions, transfers: transfers, surveys: surveys,
    notifs: notifs, annSeen: annSeen, conflicts: conflicts, realWithTestStudents: realWithTestStudents };
}
function testCounts_(sc) {
  var lessonIds = {}; sc.lessons.forEach(function (l) { lessonIds[l.lessonId] = true; });
  return {
    teachers: Object.keys(sc.tU).length, students: Object.keys(sc.tS).length, courses: Object.keys(sc.tC).length,
    lessons: Object.keys(lessonIds).length, bonuses: sc.bonuses.length, exams: Object.keys(sc.tE).length,
    other: sc.badges.length + sc.ratings.length + sc.sessions.length + sc.transfers.length + sc.surveys.length + sc.notifs.length + sc.annSeen.length + sc.examRes.length
  };
}
function testDataInfo_(u, req) {
  needDev_(u);
  var sc = testScope_();
  return {
    counts: testCounts_(sc), password: TEST_PASSWORD, limits: TEST_LIMITS,
    conflicts: sc.conflicts.map(function (c) { return courseLabel_(c) + ' (müəllim: ' + userName_(c.teacherId) + ')'; }),
    mixed: sc.realWithTestStudents.length
  };
}

function genTestData_(u, req) {
  needDev_(u);
  var n = function (k, min) {
    var v = Math.floor(Number(req[k]) || 0);
    if (v < (min || 0) || v > TEST_LIMITS[k]) throw fail_('Say düzgün deyil: ' + k + ' (0–' + TEST_LIMITS[k] + ').');
    return v;
  };
  var nT = n('teachers'), nS = n('students'), nC = n('courses'), nL = n('lessons');
  var mix = ['mixed', 'individual', 'group'].indexOf(req.mix) !== -1 ? req.mix : 'mixed';
  var withBonus = !!req.bonuses, withPast = !!req.pastMonth, withExams = !!req.exams;
  if (!nT && !nS && !nC) throw fail_('Heç olmasa bir rəqəm daxil edin.');

  var stamp = now_(), today = today_();
  var users = rawRows_('Users');
  var logins = takenLogins_();
  var stHash = null;
  var seq = 1;
  var nextLogin = function () { var l; do { l = 'test' + (seq < 10 ? '0' : '') + seq; seq++; } while (logins[l]); logins[l] = true; return l; };

  var newU = [];
  var mkTeacher = function () {
    var row = { id: newId_('U'), name: testPerson_(), login: nextLogin(), password: TEST_PASSWORD, role: 'teacher',
      permissions: '', createdAt: stamp, updatedAt: '', deletedAt: '', deletedBy: '', isTest: 'true' };
    newU.push(row); return row;
  };
  for (var i = 0; i < nT; i++) mkTeacher();

  var newS = [];
  var mkStudent = function () {
    if (!stHash) stHash = makePw_(TEST_PASSWORD);
    var nm = testPerson_();
    var row = { id: newId_('S'), name: nm, parentName: '',
      note: '', cardToken: newToken_(), status: 'active', createdAt: stamp, updatedAt: '', deletedAt: '', deletedBy: '', isTest: 'true',
      login: studentLoginFor_(nm.replace(/^Test\s+/, ''), logins), password: stHash, mustChange: '' };
    newS.push(row); return row;
  };
  for (i = 0; i < nS; i++) mkStudent();

  var newC = [], newL = [], newB = [], lessonCount = 0, autoT = 0, autoS = 0;
  if (nC) {
    var teacherPool = newU.slice();
    if (!teacherPool.length) teacherPool = rows_('Users').filter(function (x) { return isTrue_(x.isTest) && x.role === 'teacher'; });
    if (!teacherPool.length) { teacherPool = [mkTeacher()]; autoT = 1; }
    var studentPool = newS.slice();
    if (studentPool.length < 2) studentPool = studentPool.concat(rows_('Students').filter(function (x) { return isTrue_(x.isTest); }));
    var need = mix === 'individual' ? 1 : 2;
    while (studentPool.length < need) { studentPool.push(mkStudent()); autoS++; }
    var sp = 0;
    var takeStudents = function (k) {
      var out = [];
      for (var j = 0; j < k && out.length < studentPool.length; j++) {
        var s = studentPool[sp % studentPool.length]; sp++;
        if (out.indexOf(s.id) === -1) out.push(s.id);
      }
      return out;
    };
    for (i = 0; i < nC; i++) {
      var type = mix === 'mixed' ? (i % 3 === 2 ? 'group' : 'individual') : mix;
      if (type === 'group' && studentPool.length < 2) type = 'individual';
      var ids = takeStudents(type === 'group' ? Math.min(studentPool.length, 2 + Math.floor(Math.random() * 4)) : 1);
      if (type === 'group' && ids.length < 2) type = 'individual';
      var N = Math.random() < 0.7 ? 8 : 12;
      var t = teacherPool[i % teacherPool.length];
      var past = withPast && i % 2 === 0;
      var cur = past ? 2 : 1;
      var lessonsNow = Math.min(nL, N);
      var span = Math.max(lessonsNow, 1) * 3;
      var monthStart = daysAgo_(span);
      var c = { id: newId_('C'), title: type === 'group' ? 'Test qrup ' + (i + 1) + ' — ' + pick_(TEST_SUBJECTS) : '', type: type,
        teacherId: t.id, studentIds: ids.join(','), lessonsPerMonth: String(N), monthNo: String(cur), monthStart: monthStart,
        createdAt: stamp, updatedAt: '', deletedAt: '', deletedBy: '', isTest: 'true' };
      newC.push(c);
      var mkLessons = function (month, count, startAgo, spacing) {
        for (var k = 0; k < count; k++) {
          var ago = Math.max(0, startAgo - k * spacing);
          var date = daysAgo_(ago);
          var lessonId = newId_('D');
          var topic = pick_(TEST_TOPICS);
          var markedAt = ago === 0 ? stamp : date + ' 18:' + (10 + Math.floor(Math.random() * 40)) + ':00';
          var anyHeld = false;
          var rows = ids.map(function (sid) {
            var held = Math.random() < 0.86;
            if (held) anyHeld = true;
            return { sid: sid, held: held };
          });
          if (!anyHeld && Math.random() < 0.6) { rows[0].held = true; anyHeld = true; }
          rows.forEach(function (r) {
            newL.push({ id: newId_('A'), lessonId: lessonId, courseId: c.id, monthNo: String(month), date: date, studentId: r.sid,
              status: r.held ? HELD : ABSENT, reason: r.held ? '' : pick_(TEST_REASONS), topic: topic,
              markedBy: t.id, markedAt: markedAt, editedBy: '', editedAt: '' });
          });
          lessonCount++;
        }
      };

      if (past) mkLessons(1, N, span + 3 + (N - 1) * 3, 3);
      if (lessonsNow) mkLessons(cur, lessonsNow, (lessonsNow - 1) * 3, 3);
      if (withBonus) {
        ids.forEach(function (sid) {
          if (Math.random() < 0.5) newB.push({ id: newId_('BN'), studentId: sid, points: String(pick_([5, 10, 15, 20])), reason: pick_(TEST_BONUS), givenBy: t.id, createdAt: stamp });
        });
      }
    }
  }

  insertMany_('Users', newU);
  insertMany_('Students', newS);
  insertMany_('Courses', newC);
  insertMany_('Lessons', newL);
  insertMany_('Bonuses', newB);

  var newE = [], newR = [];
  if (withExams && newC.length) {
    var byT = {};
    newC.forEach(function (c) { var l = byT[c.teacherId] || (byT[c.teacherId] = []); idList_(c.studentIds).forEach(function (id) { if (l.indexOf(id) === -1 && l.length < 12) l.push(id); }); });
    Object.keys(byT).slice(0, 10).forEach(function (tid, k) {
      var pack = examTestRows_(tid, byT[tid], u.id, stamp, k + 1);
      newE.push(pack.exam); newR = newR.concat(pack.results);
    });
    insertMany_('Exams', newE);
    insertMany_('ExamResults', newR);
  }

  var res = { teachers: newU.length, students: newS.length, courses: newC.length, lessons: lessonCount, bonuses: newB.length, exams: newE.length, examResults: newR.length,
    logins: newU.map(function (x) { return x.login; }), studentLogins: newS.map(function (x) { return x.login; }), password: TEST_PASSWORD, autoTeachers: autoT, autoStudents: autoS };
  log_(u, 'dev', 'Test məlumatları yaratdı',
    res.teachers + ' müəllim, ' + res.students + ' tələbə, ' + res.courses + ' məşğələ, ' + res.lessons + ' dərs, ' + res.bonuses + ' bonus' +
    (res.exams ? ', ' + res.exams + ' imtahan (' + res.examResults + ' nəticə)' : '') + (withPast ? ' · keçmiş ay ilə' : ''));
  return res;
}

function purgeTestData_(u, req) {
  needDev_(u);
  var sc = testScope_();
  if (sc.conflicts.length) {
    throw fail_('Bu real məşğələlər test müəllimə bağlıdır: ' + sc.conflicts.map(courseLabel_).join(', ') +
      '. Əvvəlcə onlara başqa müəllim təyin edin, sonra yenidən cəhd edin.');
  }
  var counts = testCounts_(sc);
  if (!counts.teachers && !counts.students && !counts.courses) return { removed: counts };

  sc.realWithTestStudents.forEach(function (c) {
    var keep = idList_(c.studentIds).filter(function (id) { return !sc.tS[id]; });
    update_('Courses', c, { studentIds: keep.join(','), updatedAt: now_() });
  });
  var rowsOf = function (list) { return list.map(function (r) { return r._row; }); };

  sc.realExams.forEach(function (e) {
    var keep = idList_(e.studentIds).filter(function (id) { return !sc.tS[id]; });
    var keys = parseJson_(e.keys, {}), nk = {}; keep.forEach(function (id) { if (keys[id]) nk[id] = keys[id]; });
    update_('Exams', e, { studentIds: keep.join(','), keys: JSON.stringify(nk), updatedAt: now_() });
  });
  removeRows_('ExamResults', rowsOf(sc.examRes));
  removeRows_('Exams', Object.keys(sc.tE).map(function (k) { return sc.tE[k]._row; }));
  removeRows_('Lessons', rowsOf(sc.lessons));
  removeRows_('Bonuses', rowsOf(sc.bonuses));
  removeRows_('Badges', rowsOf(sc.badges));
  removeRows_('Ratings', rowsOf(sc.ratings));
  removeRows_('Sessions', rowsOf(sc.sessions));
  removeRows_('Transfers', rowsOf(sc.transfers));
  removeRows_('Surveys', rowsOf(sc.surveys));
  removeRows_('Notifs', rowsOf(sc.notifs));
  removeRows_('AnnSeen', rowsOf(sc.annSeen));
  var objRows = function (map) { return Object.keys(map).map(function (k) { return map[k]._row; }); };
  removeRows_('Courses', objRows(sc.tC));
  removeRows_('Students', objRows(sc.tS));
  removeRows_('Users', objRows(sc.tU));
  log_(u, 'dev', 'Bütün test məlumatlarını sildi',
    counts.teachers + ' müəllim, ' + counts.students + ' tələbə, ' + counts.courses + ' məşğələ, ' + counts.lessons + ' dərs, ' + counts.bonuses + ' bonus' +
    (counts.exams ? ', ' + counts.exams + ' imtahan' : '') +
    (sc.realWithTestStudents.length ? ' · ' + sc.realWithTestStudents.length + ' real məşğələdən test tələbələri çıxarıldı' : ''));
  return { removed: counts, cleanedReal: sc.realWithTestStudents.length };
}

function monthsAgo_(n) {
  var d = new Date();
  d.setMonth(d.getMonth() - n);
  return Utilities.formatDate(d, TIMEZONE, 'yyyy-MM-dd');
}
function archiveRowDate_(r, col) { return String(r[col] || '').slice(0, 10); }
function addDays_(s, days) {
  var t = new Date(String(s).replace(' ', 'T') + TZ_OFFSET).getTime();
  if (isNaN(t)) return '';
  return Utilities.formatDate(new Date(t + days * 864e5), TIMEZONE, 'yyyy-MM-dd');
}

function archiveCandidates_(name, p) {
  var col = ARCHIVE_SHEETS[name];
  if (!col) return [];
  return rawRows_(name).filter(function (r) {
    var d = archiveRowDate_(r, col);
    if (!d) return false;
    if (p.from || p.to) {
      if (p.from && d < p.from) return false;
      if (p.to && d > p.to) return false;
    } else if (!(d < p.cutoff)) return false;
    if (name === 'Logs') {
      if (p.userId && r.userId !== p.userId) return false;
      if (p.type && r.type !== p.type) return false;
    }
    if (name === 'Anns' && (r.active === 'true' || r.active === '1')) return false;
    if (name === 'Surveys' && r.status === 'sent' && ageHours_(r.sentAt) <= SURVEY_TTL_DAYS * 24) return false;
    return true;
  });
}

function devOnly_(u) { if (u.role !== 'developer') throw fail_('Bu əməliyyat yalnız developer üçündür.', 'PERM'); }

function parseArchiveReq_(req) {
  var sheets = (Array.isArray(req.sheets) ? req.sheets : []).map(String).filter(function (s, i, a) { return ARCHIVE_SHEETS[s] && a.indexOf(s) === i; });
  var from = str_(req.from, 10), to = str_(req.to, 10);
  if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) throw fail_('Başlanğıc tarixi düzgün deyil.');
  if (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw fail_('Son tarix düzgün deyil.');
  if (from && to && from > to) throw fail_('Başlanğıc tarixi son tarixdən sonra ola bilməz.');
  var cutoff = null;
  if (!from && !to) {
    var months = Number(req.months) || ARCHIVE_MONTHS;
    if ([3, 6, 12, 24].indexOf(months) === -1) months = ARCHIVE_MONTHS;
    cutoff = monthsAgo_(months);
  }
  return { sheets: sheets, from: from, to: to, cutoff: cutoff, userId: str_(req.userId, 40), type: str_(req.type, 20) };
}
function describeArchive_(p) {
  var s = p.cutoff ? p.cutoff + '-dən köhnə' : (p.from || '…') + ' — ' + (p.to || '…');
  if (p.userId) s += ' · istifadəçi: ' + userName_(p.userId);
  if (p.type) s += ' · növ: ' + p.type;
  return s;
}

function archivePreview_(u, req) {
  devOnly_(u);
  var p = parseArchiveReq_(req);
  var out = p.sheets.map(function (name) {
    return { sheet: name, label: ARCHIVE_LABELS[name], count: archiveCandidates_(name, p).length };
  });
  return { preview: out, total: out.reduce(function (s, x) { return s + x.count; }, 0), describe: describeArchive_(p) };
}

function archiveSS_() {
  var cfg = settingGet_('archive') || {};
  var year = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy');
  var ss = null;
  if (cfg[year]) { try { ss = SpreadsheetApp.openByUrl(cfg[year]); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(SCHOOL_NAME + ' — Arxiv ' + year);
    cfg[year] = ss.getUrl();
    settingSet_('archive', cfg);
  }
  return ss;
}

function appendArchive_(ss, name, rows) {
  if (!rows.length) return 0;
  var head = SCHEMA[name];
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange('A:' + colLetter_(head.length)).setNumberFormat('@');
  }
  var have = {};
  var last = sh.getLastRow();
  if (last >= 2) sh.getRange(2, 1, last - 1, 1).getValues().forEach(function (v) { have[String(v[0])] = true; });
  var keyCol = head[0];
  var data = rows.filter(function (r) { return !have[String(r[keyCol])]; })
    .map(function (r) { return head.map(function (h) { return val_(r[h]); }); });
  if (!data.length) return 0;
  var start = last + 1;
  var need = start + data.length - 1 - sh.getMaxRows();
  if (need > 0) sh.insertRowsAfter(sh.getMaxRows(), need + 50);
  sh.getRange(start, 1, data.length, head.length).setValues(data);
  return data.length;
}

function archiveSheet_(name, p, remaining) {
  var rows = archiveCandidates_(name, p);
  if (!rows.length) return { count: 0, left: 0 };
  var batch = rows.slice(0, Math.max(1, remaining));
  var ss = archiveSS_();
  appendArchive_(ss, name, batch);

  var seen = [];
  if (name === 'Anns') {
    var ids = {}; batch.forEach(function (a) { ids[a.id] = true; });
    seen = rawRows_('AnnSeen').filter(function (x) { return ids[x.annId]; });
    appendArchive_(ss, 'AnnSeen', seen);
  }
  SpreadsheetApp.flush();
  removeRows_(name, batch.map(function (r) { return r._row; }));
  if (seen.length) removeRows_('AnnSeen', seen.map(function (r) { return r._row; }));
  return { count: batch.length, left: rows.length - batch.length };
}

function archiveNow_(u, req) {
  devOnly_(u);
  var p = parseArchiveReq_(req);
  if (!p.sheets.length) throw fail_('Arxivləşəcək bölmə seçin.');
  var results = [], total = 0, left = 0;
  var remaining = ARCHIVE_BATCH;
  p.sheets.forEach(function (name) {
    if (remaining <= 0) { left += archiveCandidates_(name, p).length; return; }
    var r = archiveSheet_(name, p, remaining);
    remaining -= r.count; total += r.count; left += r.left;
    if (r.count) results.push(ARCHIVE_LABELS[name] + ': ' + r.count);
  });
  if (total) log_(u, 'dev', 'Məlumatları arxivləşdirdi', results.join(', ') + (left ? ' · qalan: ' + left : '') + ' · ' + describeArchive_(p));
  return { archived: total, left: left, details: results };
}

function autoArchiveCore_(actor, force) {
  var st = settingGet_('archiveAuto') || {};
  if (!force && st.last && ageHours_(st.last) < AUTO_ARCHIVE_DAYS * 24) return { skipped: true, last: st.last };
  var p = { cutoff: monthsAgo_(LOG_KEEP_MONTHS) };
  var results = [], total = 0;
  AUTO_ARCHIVE_SHEETS.forEach(function (name) {
    var done = 0, guard = 0;
    while (guard++ < 20) {
      var r = archiveSheet_(name, p, ARCHIVE_BATCH);
      done += r.count;
      if (!r.count || !r.left) break;
    }
    if (done) results.push(ARCHIVE_LABELS[name] + ': ' + done);
    total += done;
  });
  settingSet_('archiveAuto', { last: now_(), archived: total, by: actor ? actor.name : 'avtomatik' });
  log_(actor || null, actor ? 'dev' : 'system', actor ? 'Avtomatik arxivi əl ilə işə saldı' : 'Avtomatik arxivləşdirmə',
    (results.length ? results.join(', ') : 'köçürüləcək qeyd yox idi') + ' · ' + LOG_KEEP_MONTHS + ' aydan köhnə');
  return { archived: total, details: results };
}

function autoArchiveQuarterly() {
  job_('autoArchiveQuarterly', function () { autoArchiveCore_(null, false); });
}

function archiveAutoNow_(u, req) {
  devOnly_(u);
  return autoArchiveCore_(u, true);
}

function installTriggersRoute_(u, req) {
  devOnly_(u);
  var created = installTriggers_(!!req.force);
  log_(u, 'dev', req.force ? 'Triggerləri yenidən qurdu' : 'Triggerləri qurdu', created.length ? created.join(', ') : 'hamısı artıq qurulub idi');
  return { created: created, triggers: triggersStatus_() };
}

function archiveInfo_(u, req) {
  if (u.role !== 'developer' && u.role !== 'superadmin') throw fail_('İcazə yoxdur.', 'PERM');
  var cfg = settingGet_('archive') || {};
  var files = Object.keys(cfg).sort().reverse().map(function (y) { return { year: y, url: cfg[y] }; });
  var sections = Object.keys(ARCHIVE_SHEETS).map(function (name) {
    return { sheet: name, label: ARCHIVE_LABELS[name], note: ARCHIVE_NOTES[name] || '', count: rawRows_(name).length,
      auto: AUTO_ARCHIVE_SHEETS.indexOf(name) !== -1 };
  });
  var st = settingGet_('archiveAuto') || {};
  var users = rawRows_('Users').map(function (x) { return { id: x.id, name: x.name + (x.deletedAt ? ' (silinib)' : '') }; })
    .sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  return {
    files: files, sections: sections, locked: ARCHIVE_LOCKED, users: users,
    retentionMonths: ARCHIVE_MONTHS, autoDays: AUTO_ARCHIVE_DAYS, logKeep: LOG_KEEP_MONTHS, notifKeep: NOTIF_KEEP_DAYS,
    backup: settingGet_('backup') || null,
    autoSheets: AUTO_ARCHIVE_SHEETS.map(function (s) { return ARCHIVE_LABELS[s]; }),
    autoLast: st.last || '', autoLastCount: st.archived == null ? null : st.archived,
    autoNext: st.last ? addDays_(st.last, AUTO_ARCHIVE_DAYS) : '',
    triggers: triggersStatus_()
  };
}

var IMPORT_KEYS = {
  muellim: 'T', muellime: 'T', teacher: 'T', 'учитель': 'T', 'преподаватель': 'T', 'педагог': 'T',
  qrup: 'G', qrupu: 'G', group: 'G', 'группа': 'G',
  ferdi: 'I', ferdimesgele: 'I', ferdiders: 'I', individual: 'I', 'индивидуально': 'I', 'индивидуальные': 'I', 'индивидуальный': 'I',
  telebeler: 'S', telebe: 'S', sagirdler: 'S', students: 'S', 'ученики': 'S', 'студенты': 'S'
};
var IMPORT_SUBJECTS = [
  ['riyaziyyat', 'math'], ['математик', 'math'], ['mathem', 'math'], ['math', 'math'], ['cebr', 'math'], ['hendese', 'math'], ['geometr', 'math'],
  ['kimya', 'chem'], ['хими', 'chem'], ['chem', 'chem'],
  ['tarix', 'hist'], ['истори', 'hist'], ['hist', 'hist'],
  ['fizika', 'phys'], ['физик', 'phys'], ['phys', 'phys'],
  ['biologiya', 'bio'], ['биологи', 'bio'], ['biolog', 'bio'],
  ['ielts', 'ielts'], ['toefl', 'toefl'],
  ['ingilis', 'eng'], ['english', 'eng'], ['англий', 'eng'],
  ['rus', 'rus'], ['русск', 'rus'],
  ['azerbaycan', 'az'], ['ana dili', 'az'], ['азербайджан', 'az'],
  ['edebiyyat', 'lit'], ['литератур', 'lit'],
  ['cografiya', 'geo'], ['географи', 'geo'], ['geograf', 'geo'],
  ['informatika', 'inf'], ['информатик', 'inf'], ['proqram', 'code'], ['программ', 'code'],
  ['alman', 'ger'], ['немец', 'ger'], ['fransiz', 'fr'], ['француз', 'fr'], ['turk', 'tur'], ['турец', 'tur'], ['ereb', 'arab'], ['араб', 'arab'],
  ['ispan', 'esp'], ['испан', 'esp'], ['cin dili', 'chin'], ['китай', 'chin'], ['koreya', 'kor'], ['корей', 'kor'],
  ['mentiq', 'logic'], ['логик', 'logic'], ['ibtidai', 'prim'], ['началь', 'prim'], ['hazirliq', 'prep'], ['подготов', 'prep'],
  ['musiqi', 'mus'], ['музык', 'mus'], ['resm', 'art'], ['рисов', 'art'], ['sahmat', 'chess'], ['шахмат', 'chess'],
  ['huquq', 'law'], ['iqtisad', 'econ'], ['эконом', 'econ'], ['psixolog', 'psy'], ['психолог', 'psy']
];
var CYR_LAT = { 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'c', 'ш': 's', 'щ': 's', 'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ә': 'e', 'ғ': 'g', 'ҝ': 'g', 'ө': 'o', 'ү': 'u', 'һ': 'h', 'ҹ': 'c', 'ј': 'y' };

function latin_(s) {
  var f = fold_(s);
  try { f = f.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (e) {}
  return f.replace(/[Ѐ-ӿ]/g, function (ch) { return CYR_LAT[ch] === undefined ? '' : CYR_LAT[ch]; }).replace(/[^a-z0-9]/g, '');
}
function subjectCode_(subject) {
  var f = fold_(subject).replace(/\s+/g, ' ').trim();
  if (!f) return '';
  for (var i = 0; i < IMPORT_SUBJECTS.length; i++) if (f.indexOf(IMPORT_SUBJECTS[i][0]) !== -1) return IMPORT_SUBJECTS[i][1];
  return latin_(subject).slice(0, 4);
}

function loginFor_(name, subject, taken) {
  var first = latin_(String(name).trim().split(/\s+/)[0] || '');
  if (!first) first = latin_(name) || 'muellim';
  var base = (first.slice(0, 20) + subjectCode_(subject)).slice(0, 26);
  while (base.length < 3) base += '1';
  var login = base, n = 2;
  while (taken[login]) { login = base + n; n++; }
  taken[login] = true;
  return login;
}
function looksPhone_(s) { return /^[0-9+()\-\s]{5,25}$/.test(s) && digits_(s).length >= 5; }

function importPlan_(text) {
  var errors = [], warnings = [];
  var err = function (line, t) { if (errors.length < 200) errors.push({ line: line, text: t }); };
  var warn = function (line, t) { if (warnings.length < 200) warnings.push({ line: line, text: t }); };
  var lines = String(text || '').replace(/\r/g, '').split('\n');
  var teachers = [], tIndex = {}, loose = [];
  var curT = null, curC = null, mode = '';
  var split = function (s, comma) { return s.split(comma ? /\s*[|;\t,]\s*/ : /\s*[|;\t]\s*/).map(function (x) { return x.trim(); }); };

  lines.forEach(function (raw, i) {
    var ln = i + 1;
    var line = raw.replace(/[ ​﻿]/g, ' ').trim();
    if (!line || line[0] === '#' || line.slice(0, 2) === '//') return;
    line = line.replace(/^[-–—•*]\s+/, '').replace(/^\d{1,3}[.)]\s+/, '');
    var kw = line.match(/^([^:|;\t,0-9]{3,22}?)\s*:\s*(.*)$/);
    var kind = kw ? IMPORT_KEYS[fold_(kw[1]).replace(/\s+/g, '')] : null;

    if (kind === 'T') {
      var f = split(kw[2], true), name = '', subject = '', login = '';
      f.forEach(function (x) {
        if (!x) return;
        var lg = x.match(/^login\s*[:=]?\s*(\S+)$/i);
        if (lg) { login = lg[1]; return; }
        if (looksPhone_(x)) return;
        if (!name) name = x; else if (!subject) subject = x; else warn(ln, 'Artıq sahə nəzərə alınmadı: «' + x.slice(0, 40) + '». Login vermək üçün «login: ad» yazın.');
      });
      curC = null; mode = '';
      if (name.length < 2 || name.length > 80) { err(ln, 'Müəllimin adı yazılmayıb. Nümunə: Müəllim: Rəna Əliyeva | Riyaziyyat'); curT = null; return; }
      if (login && !/^[A-Za-z0-9._-]{3,30}$/.test(login)) { err(ln, 'Login 3–30 simvol olmalı və yalnız latın hərfləri, rəqəmlər, nöqtə, alt xətt və ya tire daxil etməlidir: ' + login); login = ''; }
      var key = fold_(name) + '|' + fold_(subject);
      if (tIndex[key]) { curT = tIndex[key]; warn(ln, '«' + name + '» siyahıda təkrarlanır. Eyni müəllim sayıldı, məşğələlər birləşdirildi.'); }
      else { curT = { line: ln, name: name.slice(0, 80), subject: subject.slice(0, 60), login: login, courses: [] }; tIndex[key] = curT; teachers.push(curT); }
      return;
    }
    if (kind === 'G') {
      if (!curT) { err(ln, 'Qrupdan əvvəl müəllim sətri olmalıdır: «Müəllim: Ad Soyad | Fənn».'); curC = null; mode = 'skip'; return; }
      var g = split(kw[2], false), title = '', N = 8;
      g.forEach(function (x) { if (!x) return; if (/^\d{1,2}$/.test(x)) N = Number(x); else if (!title) title = x; });
      if (N !== 8 && N !== 12) { err(ln, 'Aylıq dərs sayı 8 və ya 12 olmalıdır.'); N = 8; }
      curC = { line: ln, type: 'group', title: title.slice(0, 80), lessons: N, students: [] };
      curT.courses.push(curC); mode = 'group';
      return;
    }
    if (kind === 'I') {
      if (!curT) { err(ln, 'Fərdi məşğələlərdən əvvəl müəllim sətri olmalıdır: «Müəllim: Ad Soyad | Fənn».'); curC = null; mode = 'skip'; return; }
      var v = kw[2].replace(/[^\d]/g, ''), NI = v ? Number(v) : 8;
      if (NI !== 8 && NI !== 12) { err(ln, 'Aylıq dərs sayı 8 və ya 12 olmalıdır.'); NI = 8; }
      curC = null; mode = 'ind'; curT._indN = NI;
      return;
    }
    if (kind === 'S') { curT = null; curC = null; mode = 'students'; if (!kw[2].trim()) return; line = kw[2]; }

    if (mode === 'skip') return;
    var p = split(line, true), st = { line: ln, name: (p[0] || '').replace(/\s+/g, ' ').slice(0, 80), parentName: '', note: '' };
    for (var k = 1; k < p.length; k++) {
      var x = p[k]; if (!x) continue;
      var letters = /[A-Za-zƏəİıÖöÜüÇçŞşĞğА-Яа-яЁё]/.test(x);
      if (looksPhone_(x) || !letters) continue;
      if (!st.parentName && !/\d/.test(x)) st.parentName = x.replace(/^(valideyn|ana|ata|родитель)\s*[:\-–]\s*/i, '').slice(0, 80);
      else st.note = (st.note ? st.note + '; ' : '') + x.slice(0, 200);
    }
    if (st.name.indexOf(':') !== -1) { err(ln, 'Sətir oxunmadı: «' + line.slice(0, 60) + '». Açar sözlər: «Müəllim:», «Qrup:», «Fərdi:», «Tələbələr:».'); return; }
    if (st.name.length < 2 || !/[A-Za-zƏəİıÖöÜüÇçŞşĞğА-Яа-яЁё]/.test(st.name)) { err(ln, 'Tələbənin adı oxunmadı: «' + line.slice(0, 60) + '».'); return; }
    if (mode === 'group' && curC) {
      if (curC.students.some(function (y) { return fold_(y.name) === fold_(st.name); })) { warn(ln, '«' + st.name + '» bu qrupda təkrarlanır, bir dəfə sayıldı.'); return; }
      curC.students.push(st);
    } else if (mode === 'ind' && curT) {
      curT.courses.push({ line: ln, type: 'individual', title: '', lessons: curT._indN || 8, students: [st] });
    } else if (mode === 'students' || !curT) {
      if (mode !== 'students' && !loose.length) warn(ln, 'Bu sətirdən əvvəl müəllim göstərilməyib, tələbə məşğələsiz əlavə olunacaq.');
      loose.push(st);
    } else {
      err(ln, 'Tələbədən əvvəl «Qrup: …» və ya «Fərdi:» sətri olmalıdır.');
    }
  });

  teachers.forEach(function (t) {
    t.courses = t.courses.filter(function (c) {
      if (c.type !== 'group') return true;
      if (c.students.length >= 2) return true;
      err(c.line, 'Qrupda ən azı 2 tələbə olmalıdır' + (c.title ? ' («' + c.title + '»)' : '') + '. Bir tələbə üçün «Fərdi:» yazın.');
      return false;
    });
  });
  return { teachers: teachers, loose: loose, errors: errors, warnings: warnings };
}

function importResolve_(plan) {
  var users = rawRows_('Users'), liveUsers = rows_('Users'), students = rows_('Students'), courses = rows_('Courses');
  var warn = function (line, t) { if (plan.warnings.length < 200) plan.warnings.push({ line: line, text: t }); };
  var err = function (line, t) { if (plan.errors.length < 200) plan.errors.push({ line: line, text: t }); };

  var taken = {}; users.forEach(function (x) { taken[lower_(x.login)] = true; });
  plan.teachers.forEach(function (t) {
    var same = liveUsers.filter(function (x) { return (x.role === 'teacher' || x.role === 'superadmin') && fold_(x.name) === fold_(t.name); });
    var hit = same.filter(function (x) { return fold_(x.subject) === fold_(t.subject); })[0] || same.filter(function (x) { return !x.subject || !t.subject; })[0];
    if (hit) { t.isNew = false; t.id = hit.id; t.login = hit.login; if (!t.subject) t.subject = hit.subject || ''; return; }
    if (same.length) warn(t.line, '«' + t.name + '» adlı müəllim artıq var, amma fənni fərqlidir. Yeni hesab yaradılacaq.');
    t.isNew = true;
    if (t.login) {
      if (taken[lower_(t.login)]) { err(t.line, '«' + t.login + '» logini artıq istifadə olunur.'); return; }
      taken[lower_(t.login)] = true;
    } else t.login = loginFor_(t.name, t.subject, taken);
  });

  var mentions = [];
  plan.teachers.forEach(function (t) { t.courses.forEach(function (c) { c.students.forEach(function (s) { mentions.push(s); }); }); });
  plan.loose.forEach(function (s) { mentions.push(s); });
  var byName = {};
  mentions.forEach(function (s) { var k = fold_(s.name); (byName[k] = byName[k] || []).push(s); });
  var existingByName = {};
  students.forEach(function (s) { var k = fold_(s.name); (existingByName[k] = existingByName[k] || []).push(s); });
  var people = [], claimed = {};
  Object.keys(byName).forEach(function (k) {
    var list = byName[k];
    var p = { name: list[0].name, parentName: '', note: '', line: list[0].line, refs: 0 };
    list.forEach(function (s) {
      if (s.parentName && !p.parentName) p.parentName = s.parentName;
      if (s.note && !p.note) p.note = s.note;
      p.refs++; s._p = p;
    });
    var hit = (existingByName[k] || []).filter(function (e) { return !claimed[e.id]; })[0];
    if (hit) { p.isNew = false; p.id = hit.id; p.login = hit.login; claimed[hit.id] = true; }
    else p.isNew = true;
    people.push(p);
  });

  var out = [];
  plan.teachers.forEach(function (t) {
    var mine = t.isNew ? [] : courses.filter(function (c) { return c.teacherId === t.id; });
    t.courses.forEach(function (c) {
      c.teacher = t; c.isNew = true; c.add = 0;
      if (!t.isNew) {
        if (c.type === 'group' && c.title) {
          var g = mine.filter(function (x) { return x.type === 'group' && fold_(x.title) === fold_(c.title); })[0];
          if (g) { c.isNew = false; c.id = g.id; var have = idList_(g.studentIds);
            c.add = c.students.filter(function (s) { return s._p.isNew || have.indexOf(s._p.id) === -1; }).length; }
        } else if (c.type === 'group' && c.students.every(function (s) { return !s._p.isNew; })) {

          var sig = c.students.map(function (s) { return s._p.id; }).sort().join(',');
          var g2 = mine.filter(function (x) { return x.type === 'group' && idList_(x.studentIds).sort().join(',') === sig; })[0];
          if (g2) { c.isNew = false; c.id = g2.id; }
        } else if (c.type === 'individual' && !c.students[0]._p.isNew) {
          var sid = c.students[0]._p.id;
          var ind = mine.filter(function (x) { return x.type === 'individual' && idList_(x.studentIds).join(',') === sid; })[0];
          if (ind) { c.isNew = false; c.id = ind.id; }
        }
      }
      out.push(c);
    });
  });
  plan.people = people; plan.courses = out;
  return plan;
}

function importView_(plan, pw, must) {
  var T = plan.teachers, C = plan.courses, P = plan.people;
  return {
    summary: {
      teachersNew: T.filter(function (t) { return t.isNew; }).length, teachersOld: T.filter(function (t) { return !t.isNew; }).length,
      studentsNew: P.filter(function (p) { return p.isNew; }).length, studentsOld: P.filter(function (p) { return !p.isNew; }).length,
      coursesNew: C.filter(function (c) { return c.isNew; }).length, coursesOld: C.filter(function (c) { return !c.isNew; }).length,
      joins: C.reduce(function (a, c) { return a + (c.isNew ? 0 : c.add); }, 0),
      repeats: P.filter(function (p) { return p.refs > 1; }).length
    },
    teachers: T.map(function (t) { return { line: t.line, name: t.name, subject: t.subject, login: t.login, isNew: !!t.isNew, courses: t.courses.length }; }),
    courses: C.slice(0, 600).map(function (c) { return { line: c.line, type: c.type, title: c.title, teacherName: c.teacher.name, lessons: c.lessons,
      students: c.students.map(function (s) { return s.name; }), isNew: c.isNew, add: c.add }; }),
    students: P.slice(0, 800).map(function (p) { return { name: p.name, isNew: p.isNew, refs: p.refs }; }),
    studentsTotal: P.length, coursesTotal: C.length,
    errors: plan.errors, warnings: plan.warnings, password: pw, mustChange: must
  };
}

function importRun_(u, req) {
  need_(u, 'tools.import');
  var text = String(req.text || '');
  if (!text.trim()) throw fail_('Siyahını mətn sahəsinə yapışdırın.');
  if (text.length > IMPORT_LIMITS.chars) throw fail_('Siyahı həddən artıq uzundur. Onu hissələrə bölüb ayrı-ayrı idxal edin.');
  var pw = req.password === undefined || req.password === '' ? IMPORT_PASSWORD : String(req.password);
  if (pw.length < 4 || pw.length > 50 || /\s/.test(pw)) throw fail_('İlkin şifrə 4–50 simvol olmalı və boşluqsuz yazılmalıdır.');
  var must = req.mustChange !== false;

  var plan = importResolve_(importPlan_(text));
  var view = importView_(plan, pw, must);
  var sm = view.summary;
  if (sm.teachersNew > IMPORT_LIMITS.teachers || sm.studentsNew > IMPORT_LIMITS.students || sm.coursesNew > IMPORT_LIMITS.courses) {
    plan.errors.push({ line: 0, text: 'Bir dəfəyə ən çoxu ' + IMPORT_LIMITS.teachers + ' müəllim, ' + IMPORT_LIMITS.students + ' tələbə və ' + IMPORT_LIMITS.courses + ' məşğələ idxal etmək olar. Siyahını hissələrə bölün.' });
  }
  if (!plan.teachers.length && !plan.people.length && !plan.errors.length) plan.errors.push({ line: 0, text: 'Siyahıda heç bir müəllim və ya tələbə tapılmadı. «Necə istifadə etməli» düyməsindəki nümunəyə baxın.' });
  if (req.dry) { view.dry = true; return view; }
  if (plan.errors.length) throw fail_('Siyahıda ' + plan.errors.length + ' xəta var. Əvvəlcə «Yoxla» düyməsi ilə xətaları düzəldin.');
  if (!sm.teachersNew && !sm.studentsNew && !sm.coursesNew && !sm.joins) { view.done = true; view.nothing = true; view.created = []; return view; }

  var stamp = now_(), today = today_(), logs = [];
  var usedIds = {};
  var nid = function (p) { var id; do { id = newId_(p); } while (usedIds[id]); usedIds[id] = true; return id; };
  var role = ROLE_LABELS[u.role] || u.role;
  var lg = function (type, action, details) { logs.push({ id: nid('L'), time: stamp, userId: u.id, userName: u.name, role: role, type: type, action: action, details: details }); };

  var newU = [];
  plan.teachers.forEach(function (t) {
    if (!t.isNew) return;
    t.id = nid('U');
    newU.push({ id: t.id, name: t.name, login: t.login, password: pw, role: 'teacher', permissions: '',
      createdAt: stamp, updatedAt: '', deletedAt: '', deletedBy: '', newsSeenAt: '', isTest: '', mustChange: must ? 'true' : '', subject: t.subject });
    lg('teacher', 'Toplu idxal: müəllim əlavə etdi', t.name + ' · Login: ' + t.login + (t.subject ? ' · Fənn: ' + t.subject : '') + (must ? ' · ilk girişdə şifrə dəyişdirilməlidir' : ''));
  });

  var newS = [], taken = takenLogins_();
  newU.forEach(function (x) { taken[lower_(x.login)] = true; });
  var sHash = makePw_(STUDENT_PASSWORD);
  plan.people.forEach(function (p) {
    if (!p.isNew) return;
    p.id = nid('S');
    p.login = studentLoginFor_(p.name, taken);
    newS.push({ id: p.id, name: p.name, parentName: p.parentName, note: p.note || '', cardToken: newToken_(), status: 'active',
      createdAt: stamp, updatedAt: '', deletedAt: '', deletedBy: '', isTest: '', login: p.login, password: sHash, mustChange: 'true' });
    lg('student', 'Toplu idxal: tələbə əlavə etdi', p.name + ' · Login: ' + p.login + (p.parentName ? ' · Valideyn: ' + p.parentName : ''));
  });

  var newC = [], joins = 0;
  var existing = {}; rows_('Courses').forEach(function (c) { existing[c.id] = c; });
  plan.courses.forEach(function (c) {
    var ids = c.students.map(function (s) { return s._p.id; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    if (c.isNew) {
      var id = nid('C');
      newC.push({ id: id, title: c.title, type: c.type, teacherId: c.teacher.id, studentIds: ids.join(','), lessonsPerMonth: String(c.lessons), monthNo: '1', monthStart: today,
        createdAt: stamp, updatedAt: '', deletedAt: '', deletedBy: '', isTest: '' });
      lg('course', 'Toplu idxal: ' + (c.type === 'group' ? 'qrup' : 'fərdi') + ' məşğələ yaratdı',
        '«' + (c.title || c.students.map(function (s) { return s.name; }).slice(0, 2).join(', ')) + '» · Müəllim: ' + c.teacher.name + ' · Tələbə' + (ids.length > 1 ? 'lər' : '') + ': ' +
        c.students.map(function (s) { return s.name; }).join(', ') + ' · Ayda ' + c.lessons + ' dərs');
    } else if (c.type === 'group' && existing[c.id]) {
      var row = existing[c.id], have = idList_(row.studentIds), added = ids.filter(function (x) { return have.indexOf(x) === -1; });
      if (added.length) {
        update_('Courses', row, { studentIds: have.concat(added).join(','), updatedAt: stamp });
        joins += added.length;
        lg('course', 'Toplu idxal: qrupa tələbə əlavə etdi', '«' + (c.title || 'Qrup') + '» · ' + c.students.filter(function (s) { return added.indexOf(s._p.id) !== -1; }).map(function (s) { return s.name; }).join(', '));
      }
    }
  });
  insertMany_('Users', newU);
  insertMany_('Students', newS);
  insertMany_('Courses', newC);
  lg('import', 'Toplu idxal etdi', newU.length + ' müəllim, ' + newS.length + ' tələbə, ' + newC.length + ' məşğələ' + (joins ? ', mövcud qruplara ' + joins + ' tələbə' : '') +
    (newU.length ? ' · Loginlər: ' + newU.map(function (x) { return x.login; }).join(', ') : ''));
  insertMany_('Logs', logs);

  view.done = true;
  view.created = newU.map(function (x) { return { name: x.name, login: x.login, subject: x.subject }; });
  view.createdStudents = newS.map(function (x) { return { name: x.name, login: x.login }; }).sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  view.studentPassword = STUDENT_PASSWORD;
  view.result = { teachers: newU.length, students: newS.length, courses: newC.length, joins: joins };
  return view;
}

var _bumped = false;
function rev_() {
  var cache = CacheService.getScriptCache();
  var r = cache.get('rev');
  if (!r) { r = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); cache.put('rev', r, 21600); }
  return r;
}
function bumpRev_(name) {
  if (name === 'Logs' || name === 'Sessions' || name === 'Errors' || name === 'Shares' || name === 'Visits' || name === 'Problems' || _bumped) return;
  _bumped = true;
  CacheService.getScriptCache().put('rev', Date.now().toString(36) + Math.random().toString(36).slice(2, 6), 21600);
}

function sha_(s) {
  var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8);
  return b.map(function (x) { var v = (x < 0 ? x + 256 : x).toString(16); return v.length < 2 ? '0' + v : v; }).join('');
}
function makePw_(pw) {
  var salt = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
  return 'h1$' + salt + '$' + sha_(salt + ':' + pw);
}
function checkPw_(stored, pw) {
  stored = String(stored || '');
  if (!stored) return false;
  if (stored.indexOf('h1$') !== 0) return stored === String(pw);
  var p = stored.split('$');
  return p.length === 3 && sha_(p[1] + ':' + pw) === p[2];
}
function isStudentLogin_(login) { return lower_(login).indexOf(STUDENT_PREFIX) === 0; }
function takenLogins_() {
  var t = {};
  rawRows_('Users').forEach(function (x) { if (x.login) t[lower_(x.login)] = true; });
  rawRows_('Students').forEach(function (x) { if (x.login) t[lower_(x.login)] = true; });
  return t;
}
function studentLoginFor_(name, taken) {
  var parts = String(name || '').trim().split(/\s+/);
  var first = latin_(parts[0] || '') || 'telebe';
  var last = parts.length > 1 ? latin_(parts[parts.length - 1]).charAt(0) : '';
  var base = (STUDENT_PREFIX + first.slice(0, 16) + last).slice(0, 26);
  var login = base, n = 2;
  while (taken[login]) { login = base + n; n++; }
  taken[login] = true;
  return login;
}
function shortName_(name) {
  var p = String(name || '').trim().split(/\s+/);
  if (p.length < 2) return p[0] || '';
  return p[0] + ' ' + p[p.length - 1].charAt(0).toLocaleUpperCase('az') + '.';
}

function sessCreate_(id, kind, remember, from) {
  var token = newToken_(), t = Math.max(Date.now(), Number(from) || 0);
  CacheService.getScriptCache().put('s_' + token, JSON.stringify({ u: id, k: kind, t: t, r: remember ? 1 : 0 }), SESSION_SECONDS);
  if (remember) {
    insertMany_('Sessions', [{ token: sha_(token), userId: id, kind: kind, createdAt: String(t), lastAt: String(t), expiresAt: String(t + REMEMBER_DAYS * 864e5) }]);
  }
  return token;
}
function sessDrop_(token) {
  if (!token) return;
  CacheService.getScriptCache().remove('s_' + token);
  var h = sha_(token);
  var rows = rawRows_('Sessions').filter(function (x) { return x.token === h; });
  if (rows.length) removeRows_('Sessions', rows.map(function (x) { return x._row; }));
}
function sessDropFor_(id) {
  var rows = rawRows_('Sessions').filter(function (x) { return x.userId === id; });
  if (rows.length) removeRows_('Sessions', rows.map(function (x) { return x._row; }));
}
function sessTouch_(h) {
  try {
    withLock_(function () {
      delete _raw.Sessions;
      var row = rawRows_('Sessions').filter(function (x) { return x.token === h; })[0];
      if (row) setCells_('Sessions', row._row, { lastAt: String(Date.now()), expiresAt: String(Date.now() + REMEMBER_DAYS * 864e5) });
    });
  } catch (e) {}
}
function sessPurge_() {
  var now = Date.now();
  var old = rawRows_('Sessions').filter(function (x) { return Number(x.expiresAt) < now; });
  if (old.length) removeRows_('Sessions', old.map(function (x) { return x._row; }));
  return old.length;
}
function meOf_(u) {
  return { id: u.id, name: u.name, login: u.login, role: u.role };
}
function logoutAll_(u, req) {
  var sheet = u.role === 'student' ? 'Students' : 'Users';
  update_(sheet, u, { sessFrom: String(Date.now() + 1) });
  sessDropFor_(u.id);
  CacheService.getScriptCache().remove('s_' + u._token);
  if (u.role !== 'student') log_(u, 'auth', 'Bütün cihazlardan çıxdı', '');
  return { out: true };
}

function studentHandle_(action, st, req) {
  var r = S_ROUTES[action];
  if (!r) throw fail_('Bu əməliyyat üçün icazəniz yoxdur.', 'PERM');
  if (maintOn_() && action !== 'logout' && action !== 'logoutAll') {
    return { ok: false, code: 'MAINT', error: 'Sistemdə texniki işlər aparılır.', maintenance: maint_(), me: meOf_(st) };
  }
  if (isTrue_(st.mustChange) && ['changePassword', 'logout', 'logoutAll', 'setTheme'].indexOf(action) === -1) {
    return { ok: false, code: 'PWD', error: 'Davam etmək üçün əvvəlcə şifrənizi dəyişin.', me: meOf_(st) };
  }
  if (st.status === 'grad' && ['sExamStart', 'sSetAvatar', 'sBdaySet', 'sShare'].indexOf(action) !== -1) throw fail_('Məzun kabineti yalnız baxış üçündür.');
  var run = function () {
    var res = r.fn(st, req) || {};
    var out = { ok: true };
    Object.keys(res).forEach(function (k) { out[k] = res[k]; });
    return out;
  };
  return r.lock ? withLock_(run) : run();
}
var S_ROUTES = {
  sBoot:          { fn: function (st, req) { var fresh = false; try { fresh = crVisit_(st); } catch (e) { console.error(e); } return sBoot_(st, fresh ? {} : req); } },
  bootstrap:      { fn: function (st, req) { return sBoot_(st, req); } },
  sExamStart:     { fn: function (st, req) { return sExamStart_(st, req); }, lock: true },
  sProfile:       { fn: function (st, req) { return sProfile_(st, req); } },
  sReport:        { fn: function (st, req) { return sReport_(st, req); } },
  sShare:         { fn: function (st, req) { return sShare_(st, req); }, lock: true },
  logout:         { fn: function (st) { return logout_(st); }, lock: true },
  logoutAll:      { fn: function (st, req) { return logoutAll_(st, req); }, lock: true },
  setTheme:       { fn: function (st, req) { return setTheme_(st, req); } },
  sProbReport:    { fn: function (st, req) { return probReport_('s', st, req); }, lock: true },
  sSetAvatar:     { fn: function (st, req) { avSet_('Students', st, req); return { data: studentBootCore_(findStudent_(st.id) || st) }; }, lock: true },
  sBdaySet:       { fn: function (st, req) { var r = bdaySet_('Students', st, req); return { data: studentBootCore_(findStudent_(st.id) || st), md: r.md }; }, lock: true },
  changePassword: { fn: function (st, req) { return changePassword_(st, req); }, lock: true },
  markNotif:      { fn: function (st, req) { return markNotif_(st, req); }, lock: true },
  markAllNotifs:  { fn: function (st, req) { return markAllNotifs_(st, req); }, lock: true },
  dismissAnn:     { fn: function (st, req) { return dismissAnn_(st, req); }, lock: true },
  seenPopup:      { fn: function (st, req) { return seenPopup_(st, req); }, lock: true }
};

function studentCourseTitle_(c, uMap) {
  if (c.title) return c.title;
  var t = uMap[c.teacherId];
  var subj = t && t.subject ? t.subject : '';
  return (c.type === 'group' ? 'Qrup məşğələsi' : 'Fərdi məşğələ') + (subj ? ' · ' + subj : '');
}

function sBoot_(st, req) {
  if (req.since && req.since === rev_()) return { same: true, rev: req.since };
  return { data: withLock_(function () { return studentBootCore_(st); }) };
}
function studentBootCore_(st) {
  try { ratingEnsure_(); } catch (e) { console.error(e); }
  if (isActiveSt_(st)) { try { gameEval_([st.id]); } catch (e) { console.error(e); } }
  if (String(st.lastSeen || '').slice(0, 10) !== today_()) {
    var m = meta_('Students'), col = m.head.indexOf('lastSeen');
    if (col !== -1) { m.sh.getRange(st._row, col + 1).setValues([[now_()]]); st.lastSeen = now_(); }
  }
  try { crVisitCore_(st); } catch (e) { console.error(e); }
  var fresh = findStudent_(st.id) || st;
  var out = studentData_(fresh);
  try { out.cr = crInfo_(st.id); } catch (e) { console.error(e); }
  return out;
}
function devViewStudent_(u, req) {
  needDev_(u);
  var s = mustStudent_(req.id);
  if (req.first) log_(u, 'dev', 'Tələbə gözü ilə baxış', s.name);
  var d = studentData_(s);
  d.readOnly = true;
  return { data: d };
}
function sessStats_() {
  var now = Date.now(), rows = rawRows_('Sessions');
  var live = rows.filter(function (x) { return Number(x.expiresAt) >= now; });
  return { remembered: live.length, students: live.filter(function (x) { return x.kind === 's'; }).length,
    staff: live.filter(function (x) { return x.kind !== 's'; }).length, expired: rows.length - live.length,
    activeStudents7: rows_('Students').filter(function (x) { return x.lastSeen && ageHours_(x.lastSeen) < 168; }).length };
}

function studentData_(st) {
  var users = rows_('Users'), uMap = {}; users.forEach(function (x) { uMap[x.id] = x; });
  var courses = rows_('Courses');
  var lessons = rows_('Lessons');
  var cMapAll = {}; rawRows_('Courses').forEach(function (c) { cMapAll[c.id] = c; });
  var mine = courses.filter(function (c) { return idList_(c.studentIds).indexOf(st.id) !== -1; });
  var heldBy = {};
  lessons.forEach(function (l) {
    var k = l.courseId + '|' + (Number(l.monthNo) || 1);
    if (!heldBy[k]) heldBy[k] = {};
    if (l.status === HELD) heldBy[k][l.lessonId] = true;
  });
  var my = lessons.filter(function (l) { return l.studentId === st.id; });
  var cs = mine.map(function (c) {
    var N = Number(c.lessonsPerMonth) === 12 ? 12 : 8, m = Number(c.monthNo) || 1;
    var cur = my.filter(function (l) { return l.courseId === c.id && (Number(l.monthNo) || 1) === m; });
    var t = uMap[c.teacherId];
    return {
      id: c.id, title: studentCourseTitle_(c, uMap), type: c.type === 'group' ? 'group' : 'individual',
      teacherName: t ? t.name : '—', subject: t && t.subject ? t.subject : '', lessonsPerMonth: N, monthNo: m, monthStart: c.monthStart,
      held: Object.keys(heldBy[c.id + '|' + m] || {}).length,
      mine: { held: cur.filter(function (l) { return l.status === HELD; }).length, absent: cur.filter(function (l) { return l.status !== HELD; }).length }
    };
  });
  var history = my.map(function (l) {
    var c = cMapAll[l.courseId];
    return { date: l.date, courseTitle: c ? studentCourseTitle_(c, uMap) : '(silinmiş məşğələ)', monthNo: Number(l.monthNo) || 1,
      status: l.status === HELD ? HELD : ABSENT, reason: l.reason, topic: l.topic, markedAt: l.markedAt };
  }).sort(function (a, b) { return a.date !== b.date ? (a.date < b.date ? 1 : -1) : (a.markedAt < b.markedAt ? 1 : -1); });
  var held = history.filter(function (h) { return h.status === HELD; }).length;
  var months = {};
  history.forEach(function (h) { var k = h.date.slice(0, 7); var o = months[k] || (months[k] = { m: k, held: 0, absent: 0 }); if (h.status === HELD) o.held++; else o.absent++; });

  var exMap = {}; rows_('Exams').forEach(function (e) { exMap[e.id] = e; });
  var idx = examIndex_();
  var open = Object.keys(exMap).map(function (k) { return exMap[k]; }).filter(function (e) {
    return isTrue_(e.active) && idList_(e.studentIds).indexOf(st.id) !== -1;
  }).map(function (e) {
    var tries = idx.filter(function (x) { return x.examId === e.id && x.studentId === st.id; });
    var running = tries.filter(function (x) { return x.status === 'started'; })[0];
    var left = 0;
    if (running) { var a = fullRowAt_('ExamResults', running._row); left = Math.max(0, Math.round((num_(a.deadline) - Date.now()) / 1000)); }
    var p = examPublic_(e); p.id = e.id; p.attempts = tries.filter(function (x) { return x.status !== 'started'; }).length; p.running = left;
    p.createdAt = e.createdAt;
    return p;
  }).sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });

  var myNotifs = rawRows_('Notifs').filter(function (n) { return n.userId === st.id; }).sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
  var seenMap = {}; rawRows_('AnnSeen').filter(function (x) { return x.userId === st.id; }).forEach(function (x) { seenMap[x.annId] = x; });
  var anns = rawRows_('Anns').filter(function (a) { return isTrue_(a.active) && (a.audience === 'students' || a.audience === 'all'); })
    .sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
  var popup = anns.filter(function (a) { return isTrue_(a.popup) && !(seenMap[a.id] && seenMap[a.id].popupSeenAt); })[0];

  return {
    role: 'student', rev: rev_(), ver: APP_VERSION, today: today_(), now: now_(), maintenance: maint_(),
    me: { id: st.id, name: st.name, login: st.login, role: 'student', parentName: st.parentName || '', createdAt: st.createdAt, bday: bdMd_(st.bday), bdToday: bdIsToday_(bdMd_(st.bday)), grad: st.status === 'grad' },
    bdToday: bdTodayIds_(), av: avMap_(), avTop: avTop_(), avMe: avMine_(st),
    courses: cs, history: history.slice(0, 400), historyTotal: history.length,
    stats: { held: held, absent: history.length - held, rate: history.length ? Math.round(held / history.length * 100) : null },
    monthly: Object.keys(months).sort().slice(-6).map(function (k) { return months[k]; }),
    exams: { open: open, done: examsOfStudent_(st.id, uMap) },
    game: studentGame_(st.id),
    notifs: myNotifs.slice(0, 40).map(function (n) { return { id: n.id, type: n.type, text: n.text, page: n.page, param: n.param, createdAt: n.createdAt, read: !!n.readAt }; }),
    notifUnread: myNotifs.filter(function (n) { return !n.readAt; }).length,
    announcements: anns.filter(function (a) { return !(seenMap[a.id] && seenMap[a.id].dismissedAt); })
      .map(function (a) { return { id: a.id, title: a.title, body: a.body, createdAt: a.createdAt, by: userName_(a.createdBy) }; }),
    popupAnnouncement: popup ? { id: popup.id, title: popup.title, body: popup.body, by: userName_(popup.createdBy), createdAt: popup.createdAt } : null
  };
}

function sExamStart_(st, req) {
  var ex = rows_('Exams').filter(function (x) { return x.id === String(req.examId || ''); })[0];
  if (!ex || idList_(ex.studentIds).indexOf(st.id) === -1) throw fail_('İmtahan tapılmadı.', 'NOTFOUND');
  return examStart_(ex, st.id, !!req.accept, req._at);
}

function sProfile_(st, req) {
  var id = String(req.id || '');
  if (id !== st.id && !rawRows_('Ratings').some(function (r) { return r.kind === 'ind' && r.refId === id; })) throw fail_('Profil tapılmadı.', 'NOTFOUND');
  var s = findStudent_(id);
  if (!s || (id !== st.id && isTrue_(s.noRank))) throw fail_('Profil tapılmadı.', 'NOTFOUND');
  var g = studentGame_(id);
  return { profile: { id: id, name: shortName_(s.name), on: g.on, level: g.level, badges: g.on ? g.badges.filter(function (b) { return b.count; }) : [] } };
}

var LEVELS = [[0, 'Başlanğıc'], [200, 'Həvəskar'], [500, 'Bacarıqlı'], [1000, 'Bilici'], [2000, 'Ekspert'], [3500, 'Usta'], [5000, 'Əfsanə']];
var RARITY = ['', 'Adi', 'Nadir', 'Epik', 'Əfsanəvi'];
var BADGES = [
  { id: 'first', cat: 'att', name: 'İlk dərs', desc: 'İlk dərsində iştirak et', tier: 1, m: 'att', n: 1 },
  { id: 'att10', cat: 'att', name: 'Bilik yolçusu', desc: '10 dərsdə iştirak et', tier: 1, m: 'att', n: 10 },
  { id: 'att25', cat: 'att', name: 'Dəftər dolur', desc: '25 dərsdə iştirak et', tier: 1, m: 'att', n: 25 },
  { id: 'att50', cat: 'att', name: 'Elm həvəskarı', desc: '50 dərsdə iştirak et', tier: 2, m: 'att', n: 50 },
  { id: 'att100', cat: 'att', name: 'Yüz dərslik zirvə', desc: '100 dərsdə iştirak et', tier: 3, m: 'att', n: 100 },
  { id: 'att200', cat: 'att', name: 'Kitab qurdu', desc: '200 dərsdə iştirak et', tier: 4, m: 'att', n: 200 },
  { id: 'str5', cat: 'att', name: 'Ardıcıl beşlik', desc: '5 dərsə buraxmadan, ardıcıl gəl', tier: 1, m: 'maxStreak', n: 5 },
  { id: 'str10', cat: 'att', name: 'Dəmir iradə', desc: '10 dərsə ardıcıl gəl', tier: 2, m: 'maxStreak', n: 10 },
  { id: 'str25', cat: 'att', name: 'Yorulmaz tələbə', desc: '25 dərsə ardıcıl gəl', tier: 3, m: 'maxStreak', n: 25 },
  { id: 'str50', cat: 'att', name: 'Əzmkarlıq ustası', desc: '50 dərsə ardıcıl gəl', tier: 4, m: 'maxStreak', n: 50 },
  { id: 'fullm', cat: 'att', name: 'Tam ay', desc: 'Bir ayın bütün dərslərinə buraxmadan gəl', tier: 2, m: 'fullMonths', n: 1 },
  { id: 'fullm3', cat: 'att', name: 'Marafon', desc: '3 ay ardıcıl bütün dərslərə gəl', tier: 3, m: 'fullRun', n: 3 },
  { id: 'fullm6', cat: 'att', name: 'Nümunəvi tələbə', desc: '6 tam ay topla', tier: 4, m: 'fullMonths', n: 6 },
  { id: 'comeback', cat: 'att', name: 'Yenidən zirvəyə', desc: 'Buraxılmış aydan sonra növbəti ayın bütün dərslərinə gəl', tier: 2, m: 'comeback', n: 1 },
  { id: 'loyal3', cat: 'att', name: 'Sadiq tələbə', desc: '3 ay dərslərdə iştirak et', tier: 2, m: 'months', n: 3 },
  { id: 'loyal6', cat: 'att', name: 'Yarım il bilik yolunda', desc: '6 ay dərslərdə iştirak et', tier: 3, m: 'months', n: 6 },
  { id: 'loyal12', cat: 'att', name: 'Bir illik yol', desc: '12 ay dərslərdə iştirak et', tier: 4, m: 'months', n: 12 },
  { id: 'exam1', cat: 'exam', name: 'İlk sınaq', desc: 'İlk imtahanını bitir', tier: 1, m: 'exams', n: 1 },
  { id: 'exam5', cat: 'exam', name: 'Sınaq həvəskarı', desc: '5 imtahan ver', tier: 1, m: 'exams', n: 5 },
  { id: 'exam10', cat: 'exam', name: 'Sınaq ustası', desc: '10 imtahan ver', tier: 2, m: 'exams', n: 10 },
  { id: 'exam25', cat: 'exam', name: 'İmtahan veteranı', desc: '25 imtahan ver', tier: 3, m: 'exams', n: 25 },
  { id: 'pass3', cat: 'exam', name: 'Hədəfdə', desc: '3 imtahanda keçid balını topla', tier: 2, m: 'passes', n: 3 },
  { id: 'pass10', cat: 'exam', name: 'Etibarlı nəticə', desc: '10 imtahanda keçid balını topla', tier: 3, m: 'passes', n: 10 },
  { id: 'ace', cat: 'exam', name: 'Əlaçı', desc: '3 imtahanda 90% və daha çox topla', tier: 3, m: 'ge90', n: 3 },
  { id: 'ace10', cat: 'exam', name: 'Qızıl qələm', desc: '10 imtahanda 90% və daha çox topla', tier: 4, m: 'ge90', n: 10 },
  { id: 'perfect', cat: 'exam', name: 'Tam bal', desc: 'İmtahanda 100% topla', tier: 3, m: 'perfect', n: 1 },
  { id: 'perf3', cat: 'exam', name: 'Snayper', desc: '3 imtahanda ardıcıl 100% topla', tier: 4, m: 'perfRun', n: 3 },
  { id: 'fast', cat: 'exam', name: 'Sürətli ağıl', desc: 'Vaxtın yarısından az müddətdə 90% və daha çox topla', tier: 2, m: 'fast', n: 1 },
  { id: 'improve', cat: 'exam', name: 'İrəliləyiş', desc: 'İmtahanı təkrar ver və nəticəni ən azı 20% yaxşılaşdır', tier: 2, m: 'improve', n: 1 },
  { id: 'honest', cat: 'exam', name: 'Dürüst cavab', desc: '5 məhdudiyyətli imtahanı bir xəbərdarlıq almadan bitir', tier: 2, m: 'honest', n: 5 },
  { id: 'multi', cat: 'special', name: 'Çoxşaxəli', desc: 'Eyni vaxtda 2 və daha çox məşğələdə oxu', tier: 1, m: 'courses', n: 2 },
  { id: 'chosen', cat: 'special', name: 'Müəllimin tərifi', desc: 'Müəllimdən bonus bal qazan', tier: 1, m: 'bonuses', n: 1 },
  { id: 'star', cat: 'special', name: 'Sinfin ulduzu', desc: '5 dəfə bonus bal qazan', tier: 2, m: 'bonuses', n: 5 },
  { id: 'bonus10', cat: 'special', name: 'Müəllimlərin sevimlisi', desc: '10 dəfə bonus bal qazan', tier: 3, m: 'bonuses', n: 10 },
  { id: 'lvlusta', cat: 'special', name: 'Usta zirvəsi', desc: '«Usta» səviyyəsinə çat', tier: 4, m: 'levelI', n: 5 },
  { id: 'm1', cat: 'rating', name: 'Ayın birincisi', desc: 'Aylıq fərdi reytinqdə 1-ci yeri tut', tier: 4, repeat: true },
  { id: 'm2', cat: 'rating', name: 'Ayın ikincisi', desc: 'Aylıq fərdi reytinqdə 2-ci yeri tut', tier: 3, repeat: true },
  { id: 'm3', cat: 'rating', name: 'Ayın üçüncüsü', desc: 'Aylıq fərdi reytinqdə 3-cü yeri tut', tier: 3, repeat: true },
  { id: 'top10', cat: 'rating', name: 'Ən yaxşı onluq', desc: 'Aylıq fərdi reytinqdə ilk 10-luğa düş', tier: 2, repeat: true },
  { id: 'lead3', cat: 'rating', name: 'Liderlik seriyası', desc: '3 ay ardıcıl fərdi reytinqdə ilk 3-lükdə ol', tier: 4 },
  { id: 'g1', cat: 'rating', name: 'Ən güclü qrup', desc: 'Qrupun aylıq qrup reytinqində 1-ci olsun', tier: 4, repeat: true },
  { id: 'g2', cat: 'rating', name: 'Gümüş qrup', desc: 'Qrupun aylıq qrup reytinqində 2-ci olsun', tier: 3, repeat: true },
  { id: 'g3', cat: 'rating', name: 'Bürünc qrup', desc: 'Qrupun aylıq qrup reytinqində 3-cü olsun', tier: 3, repeat: true },
  { id: 'grow', cat: 'rating', name: 'Ayın ən çox irəliləyəni', desc: 'Ötən aya görə reytinq balını hamıdan çox artır', tier: 3, repeat: true },
  { id: 'ny', cat: 'season', name: 'Yeni il sehri', desc: 'Yeni ili ' + SCHOOL_NAME + ' ilə birlikdə qarşıladı', tier: 4, repeat: true, season: true },
  { id: 'nv', cat: 'season', name: 'Novruz sevinci', desc: 'Novruz bayramını ' + SCHOOL_NAME + ' ilə birlikdə qarşıladı', tier: 4, repeat: true, season: true },
  { id: 'cr4', cat: 'season', name: 'Dörd Çərşənbə', desc: 'Novruzdan əvvəlki dörd çərşənbənin hamısında sayta baş çəkdi', tier: 3, repeat: true, season: true },
  { id: 'bd', cat: 'season', name: 'Ad günü', desc: 'Ad gününü ' + SCHOOL_NAME + ' ilə birlikdə qeyd etdi', tier: 3, repeat: true, season: true },
  { id: 'all', cat: 'special', name: 'Bilik xəzinəsi', desc: 'Reytinq nişanlarından başqa bütün nişanları topla', tier: 4, m: 'collected', n: 0 }
];
var BADGE_MAP = {};
BADGES.forEach(function (b) { BADGE_MAP[b.id] = b; });
var COLLECT_IDS = BADGES.filter(function (b) { return b.cat !== 'rating' && !b.season && b.id !== 'all'; }).map(function (b) { return b.id; });
BADGE_MAP.all.n = COLLECT_IDS.length;

function gameCfg_() {
  var g = settingGet_('game');
  if (!g) return { on: false, start: today_() };
  return { on: g.on !== false, start: String(g.start || today_()).slice(0, 10) };
}
function gameRules_() {
  return { perLesson8: lessonPts_(8), perLesson12: lessonPts_(12), fullMonth: GAME.fullMonth, fullBonus: GAME.fullBonus, passBonus: GAME.passBonus,
    rankPct: GAME.rankPct, rankMinAtt: GAME.rankMinAtt, snapDay: GAME.snapDay, bonusMonth: GAME.bonusMonth, growMin: GAME.growMin };
}
function lessonPts_(N) { return Math.round(GAME.fullMonth / (Number(N) === 12 ? 12 : 8)); }
function levelOf_(pts) {
  var i = 0;
  for (var k = 0; k < LEVELS.length; k++) if (pts >= LEVELS[k][0]) i = k;
  var nx = LEVELS[i + 1];
  return { i: i, name: LEVELS[i][1], min: LEVELS[i][0], next: nx ? nx[1] : '', nextMin: nx ? nx[0] : null, pts: pts };
}
function monthOf_(offset) {
  var d = new Date(), y = Number(Utilities.formatDate(d, TIMEZONE, 'yyyy')), m = Number(Utilities.formatDate(d, TIMEZONE, 'MM')) + (offset || 0);
  while (m < 1) { m += 12; y--; }
  while (m > 12) { m -= 12; y++; }
  return y + '-' + (m < 10 ? '0' : '') + m;
}
function monthShift_(mk, d) {
  var y = Number(mk.slice(0, 4)), m = Number(mk.slice(5, 7)) + d;
  while (m < 1) { m += 12; y--; }
  while (m > 12) { m -= 12; y++; }
  return y + '-' + (m < 10 ? '0' : '') + m;
}
function isActiveSt_(s) { return !!s && (!s.status || s.status === 'active'); }
function stCanEnter_(s) { return isActiveSt_(s) || (!!s && s.status === 'grad'); }
function gameBlank_(id) {
  return { id: id, total: 0, months: {}, ev: [], att: 0, mAtt: {}, mRec: {}, mCourses: {}, streak: 0, maxStreak: 0, fullMonths: 0, fullRun: 0, comeback: 0,
    months_: 0, exams: 0, passes: 0, ge90: 0, perfect: 0, perfRun: 0, fast: 0, improve: 0, honest: 0, bonuses: 0, courses: 0, bonusMonth: {}, levelI: 0, collected: 0 };
}
function gameCompute_() {
  if (_raw['#game']) return _raw['#game'];
  var cfg = gameCfg_(), start = cfg.start, startTs = start + ' 00:00:00';
  var all = {}, act = {};
  rows_('Students').forEach(function (s) { all[s.id] = s; if (isActiveSt_(s)) act[s.id] = s; });
  var courses = rows_('Courses');
  var allC = {}; rawRows_('Courses').forEach(function (c) { allC[c.id] = c; });
  var uMap = {}; rows_('Users').forEach(function (x) { uMap[x.id] = x; });
  var st = {};
  var S = function (id) { return st[id] || (st[id] = gameBlank_(id)); };
  var add = function (o, date, p, k, t, cid) {
    o.total += p;
    var mk = String(date).slice(0, 7);
    o.months[mk] = (o.months[mk] || 0) + p;
    o.ev.push({ d: String(date).slice(0, 10), p: p, k: k, t: t, c: cid || '' });
  };
  var ls = rows_('Lessons').filter(function (l) { return all[l.studentId] && l.date >= start; }).sort(function (a, b) {
    return a.date !== b.date ? (a.date < b.date ? -1 : 1) : (a.markedAt < b.markedAt ? -1 : (a.markedAt > b.markedAt ? 1 : 0));
  });
  var fm = {}, held = {};
  ls.forEach(function (l) {
    var o = S(l.studentId), mk = l.date.slice(0, 7), mNo = Number(l.monthNo) || 1;
    var c = allC[l.courseId], N = c && Number(c.lessonsPerMonth) === 12 ? 12 : 8;
    var k = l.studentId + '|' + l.courseId + '|' + mNo;
    var f = fm[k] || (fm[k] = { h: 0, a: 0, c: l.courseId, sid: l.studentId, m: mNo, N: N, last: '' });
    o.mRec[mk] = (o.mRec[mk] || 0) + 1;
    (o.mCourses[mk] = o.mCourses[mk] || {})[l.courseId] = true;
    if (l.status === HELD) {
      var hk = l.courseId + '|' + mk;
      (held[hk] = held[hk] || {})[l.lessonId || l.date] = true;
      f.h++; f.last = l.date; o.att++; o.mAtt[mk] = (o.mAtt[mk] || 0) + 1;
      add(o, l.date, lessonPts_(N), 'lesson', 'Dərs · ' + (c ? studentCourseTitle_(c, uMap) : 'məşğələ'), l.courseId);
      o.streak++;
      if (o.streak > o.maxStreak) o.maxStreak = o.streak;
      if (f.h === N && f.a === 0) add(o, l.date, GAME.fullBonus, 'full', 'Tam ay · ' + (c ? studentCourseTitle_(c, uMap) : 'məşğələ'), l.courseId);
    } else { f.a++; o.streak = 0; }
  });
  var byCourse = {};
  Object.keys(fm).forEach(function (k) {
    var f = fm[k];
    f.full = f.h >= f.N && f.a === 0;
    if (f.full) S(f.sid).fullMonths++;
    (byCourse[f.sid + '|' + f.c] = byCourse[f.sid + '|' + f.c] || []).push(f);
  });
  Object.keys(byCourse).forEach(function (k) {
    var list = byCourse[k].sort(function (a, b) { return a.m - b.m; }), o = S(list[0].sid), run = 0, prev = null;
    list.forEach(function (f) {
      if (f.full) { run = prev && prev.m === f.m - 1 && prev.full ? run + 1 : 1; if (run > o.fullRun) o.fullRun = run; }
      else run = 0;
      if (f.full && prev && prev.m === f.m - 1 && prev.a >= 2) o.comeback = 1;
      prev = f;
    });
  });
  Object.keys(st).forEach(function (id) { st[id].months_ = Object.keys(st[id].mAtt).length; });
  var exMap = {}; rows_('Exams').forEach(function (e) { exMap[e.id] = e; });
  var groups = {};
  if (examIndex_().length) {
    rawRows_('ExamResults').forEach(function (a) {
      if (a.status === 'started' || !all[a.studentId] || !exMap[a.examId] || String(a.finishedAt) < startTs) return;
      var k = a.studentId + '|' + a.examId;
      (groups[k] = groups[k] || []).push(a);
    });
  }
  var bests = {};
  Object.keys(groups).forEach(function (k) {
    var list = groups[k].sort(function (a, b) { return a.finishedAt < b.finishedAt ? -1 : 1; });
    var ok = list.filter(function (a) { return a.endReason !== 'violations'; });
    if (!ok.length) return;
    var sid = list[0].studentId, ex = exMap[list[0].examId], o = S(sid);
    o.exams++;
    var best = ok[0], bestPct = pct_(ok[0].score, ok[0].maxPoints), minPct = bestPct, improved = false;
    ok.forEach(function (a, i) {
      var p = pct_(a.score, a.maxPoints);
      if (p > bestPct) { best = a; bestPct = p; }
      if (i > 0 && p - minPct >= 20) improved = true;
      if (p < minPct) minPct = p;
      if (a.status === 'done' && p >= 100) o.perfect = 1;
      if (a.status === 'done' && p >= 90 && num_(a.spent) > 0 && num_(a.spent) <= num_(a.dur) * 30) o.fast = 1;
    });
    if (improved) o.improve = 1;
    add(o, best.finishedAt, Math.round(bestPct / 2), 'exam', 'İmtahan · ' + ex.title, '');
    if (num_(best.passMin) > 0 && num_(best.score) >= num_(best.passMin)) { o.passes++; add(o, best.finishedAt, GAME.passBonus, 'pass', 'Keçid balı · ' + ex.title, ''); }
    if (bestPct >= 90) o.ge90++;
    if (isTrue_(ex.strict) && ok.some(function (a) { return num_(a.violations) === 0; })) o.honest++;
    (bests[sid] = bests[sid] || []).push({ at: ok[0].finishedAt, pct: bestPct });
  });
  Object.keys(bests).forEach(function (sid) {
    var run = 0, o = S(sid);
    bests[sid].sort(function (a, b) { return a.at < b.at ? -1 : 1; }).forEach(function (x) {
      run = x.pct >= 100 ? run + 1 : 0;
      if (run > o.perfRun) o.perfRun = run;
    });
  });
  rows_('Bonuses').forEach(function (b) {
    if (!all[b.studentId]) return;
    var o = S(b.studentId), mk = String(b.createdAt).slice(0, 7);
    o.bonusMonth[mk] = (o.bonusMonth[mk] || 0) + num_(b.points);
    if (String(b.createdAt) < startTs) return;
    o.bonuses++;
    add(o, b.createdAt, num_(b.points), 'bonus', 'Bonus · ' + (b.reason || ''), '');
  });
  courses.forEach(function (c) { idList_(c.studentIds).forEach(function (id) { if (act[id]) S(id).courses++; }); });
  Object.keys(st).forEach(function (id) { st[id].levelI = levelOf_(st[id].total).i; });
  var out = { cfg: cfg, st: st, all: all, live: act, courses: courses, uMap: uMap, held: held };
  _raw['#game'] = out;
  return out;
}
function monthScore_(o, mk) {
  var n = Object.keys(o.mCourses[mk] || {}).length;
  return Math.round((o.months[mk] || 0) / Math.max(1, n));
}
function qualifies_(o, mk) {
  var a = o.mAtt[mk] || 0, r = o.mRec[mk] || 0;
  return a >= GAME.rankMinAtt && r > 0 && a * 100 >= r * GAME.rankPct;
}
function badgeRows_() {
  return rows_('Badges');
}
function earnedOf_(sid) {
  var map = {};
  badgeRows_().forEach(function (r) {
    if (r.studentId !== sid || r.state === 'revoked') return;
    var e = map[r.badge] || (map[r.badge] = { count: 0, last: '', manual: false });
    e.count++;
    if (r.earnedAt > e.last) e.last = r.earnedAt;
    if (r.by) e.manual = true;
  });
  return map;
}
function badgeMetric_(o, b, earned) {
  if (b.m === 'months') return o.months_;
  if (b.m === 'collected') return COLLECT_IDS.filter(function (id) { return earned && earned[id]; }).length;
  return Number(o[b.m]) || 0;
}
function badgeShare_() {
  if (_raw['#bshare']) return _raw['#bshare'];
  var act = {}, n = 0;
  rows_('Students').forEach(function (s) { if (isActiveSt_(s)) { act[s.id] = true; n++; } });
  var have = {};
  badgeRows_().forEach(function (r) { if (r.state !== 'revoked' && act[r.studentId]) (have[r.badge] = have[r.badge] || {})[r.studentId] = true; });
  var out = {};
  BADGES.forEach(function (b) { out[b.id] = n ? Math.round(Object.keys(have[b.id] || {}).length / n * 100) : 0; });
  _raw['#bshare'] = out;
  return out;
}
function badgeView_(b, e, o, share) {
  var x = { id: b.id, cat: b.cat, name: b.name, desc: b.desc, tier: b.tier, rarity: RARITY[b.tier], repeat: !!b.repeat, rating: b.cat === 'rating',
    count: e ? e.count : 0, last: e ? e.last : '', manual: !!(e && e.manual), share: share ? share[b.id] : 0 };
  if (o && b.m) { x.need = b.n; x.cur = Math.min(badgeMetric_(o, b, o._earned), b.n); }
  return x;
}
function rankList_(comp, mk) {
  return Object.keys(comp.live).filter(function (sid) { return !isTrue_(comp.live[sid].noRank); }).map(function (sid) {
    var o = comp.st[sid] || gameBlank_(sid);
    return { sid: sid, p: monthScore_(o, mk), raw: o.months[mk] || 0, a: o.mAtt[mk] || 0, ok: qualifies_(o, mk), name: comp.live[sid].name };
  }).filter(function (x) { return x.ok && x.p > 0; }).sort(function (a, b) {
    return (b.p - a.p) || (b.a - a.a) || a.name.localeCompare(b.name, 'az');
  });
}
function groupTitle_(c, uMap) {
  if (c.title) return c.title;
  var t = uMap[c.teacherId];
  return 'Qrup · ' + (t ? t.name : 'müəllim');
}
function groupRank_(comp, mk) {
  return comp.courses.filter(function (c) { return c.type === 'group'; }).map(function (c) {
    var ids = idList_(c.studentIds).filter(function (id) { return comp.live[id]; });
    if (ids.length < 2) return null;
    var N = Number(c.lessonsPerMonth) === 12 ? 12 : 8;
    var heldN = Object.keys(comp.held[c.id + '|' + mk] || {}).length;
    if (heldN * 2 < N) return null;
    var sum = 0;
    ids.forEach(function (id) { var o = comp.st[id]; sum += o ? monthScore_(o, mk) : 0; });
    var t = comp.uMap[c.teacherId];
    return { c: c, ids: ids, title: groupTitle_(c, comp.uMap), teacher: t ? t.name : '', subject: t && t.subject ? t.subject : '', avg: Math.round(sum / ids.length * 10) / 10, held: heldN };
  }).filter(function (x) { return x && x.avg > 0; }).sort(function (a, b) { return (b.avg - a.avg) || a.title.localeCompare(b.title, 'az'); });
}
function leaders_(month) {
  var rows = rawRows_('Ratings');
  if (!rows.length) return null;
  var months = {};
  rows.forEach(function (r) { months[r.month] = true; });
  var list = Object.keys(months).sort();
  var mk = month && months[month] ? month : list[list.length - 1];
  var sel = rows.filter(function (r) { return r.month === mk; });
  var hidden = {};
  rows_('Students').forEach(function (s) { if (isTrue_(s.noRank)) hidden[s.id] = true; });
  var map = function (kind) {
    return sel.filter(function (r) { return r.kind === kind && !(kind !== 'grp' && hidden[r.refId]); }).sort(function (a, b) { return num_(a.place) - num_(b.place); }).map(function (r) {
      var x = parseJson_(r.extra, {}) || {};
      return { place: num_(r.place), id: kind !== 'grp' ? r.refId : '', name: r.name, points: num_(r.points), teacher: x.teacher || '', subject: x.subject || '', members: x.members || 0, lessons: x.lessons || 0,
        from: x.from || 0, to: x.to || 0 };
    });
  };
  return { month: mk, months: list.slice().reverse(), ind: map('ind'), grp: map('grp'), grow: map('grow')[0] || null, next: nextSnap_() };
}
function nextSnap_() {
  var day = Number(Utilities.formatDate(new Date(), TIMEZONE, 'dd'));
  var mk = day >= GAME.snapDay ? monthOf_(1) : monthOf_(0);
  return mk + '-' + (GAME.snapDay < 10 ? '0' : '') + GAME.snapDay;
}
function ratingEnsure_() {
  var cfg = gameCfg_();
  if (!cfg.on) return false;
  var day = Number(Utilities.formatDate(new Date(), TIMEZONE, 'dd'));
  if (day < GAME.snapDay) return false;
  var prev = monthOf_(-1);
  if (prev < cfg.start.slice(0, 7)) return false;
  if (rawRows_('Ratings').some(function (r) { return r.month === prev; })) return false;
  ratingSnapshot_(prev);
  return true;
}
function ratingSnapshot_(mk) {
  var comp = gameCompute_();
  var stamp = now_(), rows = [], badges = [], notes = [];
  var past = {};
  rawRows_('Ratings').forEach(function (r) { if (r.kind === 'ind' && num_(r.place) <= 3) (past[r.refId] = past[r.refId] || {})[r.month] = true; });
  var haveLead = {};
  badgeRows_().forEach(function (b) { if (b.badge === 'lead3' && b.state !== 'revoked') haveLead[b.studentId] = true; });
  var give = function (sid, id) { badges.push({ id: newId_('B'), studentId: sid, badge: id, earnedAt: stamp, month: mk, by: '', note: '', state: '' }); notes.push([sid, BADGE_MAP[id].name]); };
  var ind = rankList_(comp, mk).slice(0, GAME.topInd);
  ind.forEach(function (x, i) {
    rows.push({ id: newId_('RT'), month: mk, kind: 'ind', place: String(i + 1), refId: x.sid, name: shortName_(x.name), points: String(x.p),
      extra: JSON.stringify({ lessons: x.a }), createdAt: stamp });
    if (i < 3) give(x.sid, 'm' + (i + 1));
    give(x.sid, 'top10');
    if (i < 3 && !haveLead[x.sid]) {
      var p = past[x.sid] || {};
      if (p[monthShift_(mk, -1)] && p[monthShift_(mk, -2)]) give(x.sid, 'lead3');
    }
  });
  var grp = groupRank_(comp, mk).slice(0, GAME.topGrp);
  grp.forEach(function (g, i) {
    rows.push({ id: newId_('RT'), month: mk, kind: 'grp', place: String(i + 1), refId: g.c.id, name: g.title, points: String(g.avg),
      extra: JSON.stringify({ teacher: g.teacher, subject: g.subject, members: g.ids.length }), createdAt: stamp });
    if (i < 3) g.ids.forEach(function (sid) { give(sid, 'g' + (i + 1)); });
  });
  var gr = growPick_(comp, mk);
  if (gr) {
    rows.push({ id: newId_('RT'), month: mk, kind: 'grow', place: '1', refId: gr.sid, name: shortName_(gr.name), points: String(gr.d),
      extra: JSON.stringify({ from: gr.a, to: gr.b }), createdAt: stamp });
    give(gr.sid, 'grow');
  }
  if (!rows.length) rows.push({ id: newId_('RT'), month: mk, kind: 'none', place: '0', refId: '', name: '', points: '0', extra: '', createdAt: stamp });
  insertMany_('Ratings', rows);
  insertMany_('Badges', badges);
  var per = {};
  notes.forEach(function (n) { (per[n[0]] = per[n[0]] || []).push(n[1]); });
  Object.keys(per).forEach(function (sid) { notify_([sid], 'badge', 'Təbriklər! ' + fmtMonthAz_(mk) + ' ayının nəticəsi: ' + per[sid].map(function (x) { return '«' + x + '»'; }).join(', '), 'sBadges', ''); });
  log_(null, 'game', 'Ayın reytinqi yekunlaşdı', fmtMonthAz_(mk) + ' · Fərdi: ' + ind.length + ' tələbə, qrup: ' + grp.length + (ind[0] ? ' · 1-ci yer: ' + shortName_(ind[0].name) : ''));
  delete _raw['#game']; delete _raw['#bshare'];
}
var AZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
function fmtMonthAz_(mk) { return AZ_MONTHS[Number(mk.slice(5, 7)) - 1] + ' ' + mk.slice(0, 4); }
function gameEval_(ids) {
  var cfg = gameCfg_();
  if (!cfg.on) return 0;
  var comp = gameCompute_();
  var have = {}, earnedBy = {};
  badgeRows_().forEach(function (b) {
    have[b.studentId + '|' + b.badge] = true;
    if (b.state !== 'revoked') (earnedBy[b.studentId] = earnedBy[b.studentId] || {})[b.badge] = true;
  });
  var add = [], stamp = now_(), lv = [];
  (ids || Object.keys(comp.live)).forEach(function (sid) {
    var s = comp.live[sid];
    if (!s) return;
    var o = comp.st[sid] || gameBlank_(sid);
    var mine = earnedBy[sid] || (earnedBy[sid] = {});
    BADGES.forEach(function (b) {
      if (!b.m || b.id === 'all' || have[sid + '|' + b.id]) return;
      if (badgeMetric_(o, b, mine) >= b.n) {
        add.push({ id: newId_('B'), studentId: sid, badge: b.id, earnedAt: stamp, month: '', by: '', note: '', state: '' });
        have[sid + '|' + b.id] = true; mine[b.id] = true;
      }
    });
    if (!have[sid + '|all'] && badgeMetric_(o, BADGE_MAP.all, mine) >= BADGE_MAP.all.n) {
      add.push({ id: newId_('B'), studentId: sid, badge: 'all', earnedAt: stamp, month: '', by: '', note: '', state: '' });
      have[sid + '|all'] = true;
    }
    var l = levelOf_(o.total);
    if (l.i > (Number(s.lvl) || 0)) lv.push([s, l]);
  });
  if (add.length) {
    insertMany_('Badges', add);
    add.forEach(function (b) { notify_([b.studentId], 'badge', 'Yeni nişan qazandın: «' + BADGE_MAP[b.badge].name + '»', 'sBadges', ''); });
  }
  lv.forEach(function (x) {
    update_('Students', x[0], { lvl: String(x[1].i) });
    notify_([x[0].id], 'level', 'Yeni səviyyəyə çatdın: «' + x[1].name + '».', 'sHome', '');
  });
  if (add.length) { delete _raw['#game']; delete _raw['#bshare']; }
  return add.length;
}
function studentGame_(sid) {
  var cfg = gameCfg_();
  if (!cfg.on) return { on: false };
  var comp = gameCompute_();
  var o = comp.st[sid] || gameBlank_(sid);
  var mk = monthOf_(0);
  var earned = earnedOf_(sid);
  o._earned = earned;
  var share = badgeShare_();
  var badges = BADGES.filter(function (b) { return !b.season || earned[b.id]; }).map(function (b) { return badgeView_(b, earned[b.id], o, share); });
  var s = comp.all[sid] || {};
  var hidden = isTrue_(s.noRank);
  var live = rankList_(comp, mk);
  var pos = -1;
  for (var i = 0; i < live.length; i++) if (live[i].sid === sid) { pos = i; break; }
  var gl = groupRank_(comp, mk);
  var myGroups = [];
  gl.forEach(function (g, i) { if (g.ids.indexOf(sid) !== -1) myGroups.push({ title: g.title, place: i + 1, of: gl.length, avg: g.avg }); });
  return {
    on: true, start: cfg.start, month: mk, total: o.total, monthPts: o.months[mk] || 0, monthScore: monthScore_(o, mk), monthLessons: o.mAtt[mk] || 0,
    monthCourses: Object.keys(o.mCourses[mk] || {}).length, qualifies: qualifies_(o, mk),
    level: levelOf_(o.total), levels: LEVELS, streak: o.streak, maxStreak: o.maxStreak,
    events: o.ev.slice(-60).reverse(), badges: badges, hidden: hidden,
    rank: pos === -1 ? null : { place: pos + 1, of: live.length },
    groups: myGroups, leaders: leaders_(null), rules: gameRules_(),
    byMonth: Object.keys(o.months).sort().slice(-12).map(function (k) { return { m: k, pts: o.months[k] || 0 }; })
  };
}
function gameSummary_(sid) {
  var cfg = gameCfg_();
  if (!cfg.on) return null;
  var comp = gameCompute_();
  var o = comp.st[sid] || gameBlank_(sid);
  var earned = earnedOf_(sid), share = badgeShare_();
  var s = comp.all[sid] || {};
  return {
    total: o.total, monthPts: o.months[monthOf_(0)] || 0, monthScore: monthScore_(o, monthOf_(0)), level: levelOf_(o.total), hidden: isTrue_(s.noRank),
    badges: BADGES.filter(function (b) { return earned[b.id]; }).map(function (b) { return badgeView_(b, earned[b.id], null, share); }),
    badgeTotal: BADGES.filter(function (b) { return !b.season; }).length
  };
}
function gameDaily_() {
  try { ratingEnsure_(); } catch (e) { jobErr_(e, 'reytinq'); }
  try { gameEval_(null); } catch (e) { jobErr_(e, 'nişanlar'); }
}

function canBonusFor_(u, sid) {
  if (u.role === 'superadmin' || can_(u, 'game.bonus')) return true;
  return rows_('Courses').some(function (c) { return c.teacherId === u.id && idList_(c.studentIds).indexOf(sid) !== -1; });
}
function canResetFor_(u, sid) {
  if (u.role === 'superadmin' || can_(u, 'students.reset')) return true;
  return rows_('Courses').some(function (c) { return c.teacherId === u.id && idList_(c.studentIds).indexOf(sid) !== -1; });
}
function gameCatalog_() {
  var share = badgeShare_();
  return BADGES.map(function (b) { return badgeView_(b, null, null, share); });
}

function gameBoard_(u, req) {
  var cfg = gameCfg_();
  var all = u.role === 'superadmin' || can_(u, 'game.bonus');
  var mine = {};
  rows_('Courses').forEach(function (c) { if (c.teacherId === u.id) idList_(c.studentIds).forEach(function (id) { mine[id] = true; }); });
  if (!all && !Object.keys(mine).length && u.role !== 'teacher') throw fail_('Reytinq bölməsi üçün icazəniz yoxdur.', 'PERM');
  if (!cfg.on) return { on: false, canToggle: boss_(u), start: cfg.start };
  if (!u._readOnly) { try { ratingEnsure_(); } catch (e) { console.error(e); } }
  var comp = gameCompute_(), mk = monthOf_(0);
  var live = rankList_(comp, mk), place = {};
  live.forEach(function (x, i) { place[x.sid] = i + 1; });
  var scope = Object.keys(comp.live).filter(function (id) { return all || mine[id]; });
  var counts = {};
  badgeRows_().forEach(function (b) { if (b.state !== 'revoked') counts[b.studentId] = (counts[b.studentId] || 0) + 1; });
  var rows = scope.map(function (sid) {
    var o = comp.st[sid] || gameBlank_(sid), s = comp.live[sid], lv = levelOf_(o.total);
    return { id: sid, name: s.name, total: o.total, month: monthScore_(o, mk), raw: o.months[mk] || 0, courses: Object.keys(o.mCourses[mk] || {}).length,
      lessons: o.mAtt[mk] || 0, ok: qualifies_(o, mk), place: place[sid] || 0, hidden: isTrue_(s.noRank),
      level: lv.name, levelI: lv.i, badges: counts[sid] || 0,
      bonusLeft: Math.max(0, GAME.bonusMonth - (o.bonusMonth[mk] || 0)), canBonus: !u._readOnly && canBonusFor_(u, sid), streak: o.streak };
  }).sort(function (a, b) { return ((a.place || 999) - (b.place || 999)) || (b.month - a.month) || (b.total - a.total) || a.name.localeCompare(b.name, 'az'); });
  var gl = groupRank_(comp, mk);
  var groups = gl.map(function (g, i) { return { id: g.c.id, place: i + 1, title: g.title, teacher: g.teacher, avg: g.avg, members: g.ids.length, mine: g.c.teacherId === u.id }; })
    .filter(function (g) { return all || g.mine; });
  var bonuses = rows_('Bonuses').filter(function (b) { return all || mine[b.studentId] || b.givenBy === u.id; })
    .sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; }).slice(0, 40).map(function (b) {
      return { id: b.id, studentName: comp.all[b.studentId] ? comp.all[b.studentId].name : '(silinmiş tələbə)', points: num_(b.points), reason: b.reason,
        by: userName_(b.givenBy), at: b.createdAt,
        canDelete: !u._readOnly && (u.role === 'superadmin' || can_(u, 'game.bonus') || (b.givenBy === u.id && ageHours_(b.createdAt) < 24)) };
    });
  var isSuper = boss_(u);
  return { on: true, start: cfg.start, month: mk, all: all, rows: rows, groups: groups, leaders: leaders_(req.month || null), bonuses: bonuses,
    canToggle: isSuper, canManage: isSuper, limits: { min: GAME.bonusMin, max: GAME.bonusMax, month: GAME.bonusMonth },
    rules: gameRules_(), levels: LEVELS, catalog: gameCatalog_() };
}
function giveBonus_(u, req) {
  if (!gameCfg_().on) throw fail_('Nailiyyətlər sistemi söndürülüb.');
  var s = mustStudent_(req.studentId);
  if (!isActiveSt_(s)) throw fail_('Bu tələbə kursu tərk edib.');
  if (!canBonusFor_(u, s.id)) throw fail_('Yalnız öz tələbələrinizə bonus verə bilərsiniz.', 'PERM');
  var p = Math.floor(Number(req.points));
  if (!(p >= GAME.bonusMin && p <= GAME.bonusMax)) throw fail_('Bonus ' + GAME.bonusMin + '–' + GAME.bonusMax + ' bal aralığında olmalıdır.');
  var reason = reqStr_(req.reason, 'Səbəb', 3, 120);
  var mk = monthOf_(0);
  var used = rows_('Bonuses').filter(function (b) { return b.studentId === s.id && String(b.createdAt).slice(0, 7) === mk; })
    .reduce(function (a, b) { return a + num_(b.points); }, 0);
  if (used + p > GAME.bonusMonth) throw fail_('Bu ay bu tələbəyə ən çoxu ' + GAME.bonusMonth + ' bal bonus vermək olar. Qalıb: ' + Math.max(0, GAME.bonusMonth - used) + ' bal.');
  insertMany_('Bonuses', [{ id: newId_('BN'), studentId: s.id, points: String(p), reason: reason, givenBy: u.id, createdAt: now_() }]);
  log_(u, 'bonus', 'Bonus bal verdi', s.name + ' · +' + p + ' bal · ' + reason);
  notify_([s.id], 'bonus', u.name + ' sənə +' + p + ' bonus bal verdi: ' + reason, 'sHome', '');
  return { left: GAME.bonusMonth - used - p };
}
function deleteBonus_(u, req) {
  var b = rows_('Bonuses').filter(function (x) { return x.id === String(req.id); })[0];
  if (!b) throw fail_('Bonus tapılmadı.');
  var ok = u.role === 'superadmin' || can_(u, 'game.bonus') || (b.givenBy === u.id && ageHours_(b.createdAt) < 24);
  if (!ok) throw fail_('Bu bonusu silmək üçün icazəniz yoxdur.', 'PERM');
  removeRows_('Bonuses', [b._row]);
  log_(u, 'bonus', 'Bonusu sildi', studentName_(b.studentId) + ' · ' + b.points + ' bal · ' + b.reason);
  return {};
}
function setGame_(u, req) {
  if (!boss_(u)) throw fail_('Bu ayar yalnız rəhbərlik üçündür.', 'PERM');
  var cfg = gameCfg_(), on = !!req.on;
  settingSet_('game', { on: on, start: cfg.start });
  log_(u, 'game', on ? 'Nailiyyətlər sistemini açdı' : 'Nailiyyətlər sistemini söndürdü', '');
  return { on: on };
}
function needSuper_(u) { if (!boss_(u)) throw fail_('Bu əməliyyat yalnız rəhbərlik üçündür.', 'PERM'); }

function gameAudit_(u, req) {
  if (!boss_(u)) throw fail_('Bu bölmə yalnız rəhbərlik üçündür.', 'PERM');
  var s = mustStudent_(req.studentId);
  var comp = gameCompute_();
  var o = comp.st[s.id] || gameBlank_(s.id);
  var earned = earnedOf_(s.id);
  o._earned = earned;
  var share = badgeShare_();
  var months = {};
  Object.keys(o.months).concat(Object.keys(o.mRec)).forEach(function (mk) { months[mk] = true; });
  var ratings = {};
  rawRows_('Ratings').forEach(function (r) { if (r.kind === 'ind' && r.refId === s.id) ratings[r.month] = num_(r.place); });
  var cur = monthOf_(0), live = rankList_(comp, cur), livePlace = 0;
  live.forEach(function (x, i) { if (x.sid === s.id) livePlace = i + 1; });
  var mlist = Object.keys(months).sort().reverse().map(function (mk) {
    var ev = o.ev.filter(function (e) { return e.d.slice(0, 7) === mk; });
    var sum = function (k) { return ev.filter(function (e) { return e.k === k; }).reduce(function (a, e) { return a + e.p; }, 0); };
    return { month: mk, label: fmtMonthAz_(mk), points: o.months[mk] || 0, score: monthScore_(o, mk), courses: Object.keys(o.mCourses[mk] || {}).length,
      att: o.mAtt[mk] || 0, rec: o.mRec[mk] || 0, ok: qualifies_(o, mk), place: mk === cur ? livePlace : (ratings[mk] || 0), live: mk === cur,
      parts: { lesson: sum('lesson'), full: sum('full'), exam: sum('exam'), pass: sum('pass'), bonus: sum('bonus') }, bonusUsed: o.bonusMonth[mk] || 0 };
  });
  var log = badgeRows_().filter(function (b) { return b.studentId === s.id; }).sort(function (a, b) { return a.earnedAt < b.earnedAt ? 1 : -1; }).map(function (b) {
    var d = BADGE_MAP[b.badge];
    return { id: b.id, badge: b.badge, name: d ? d.name : b.badge, at: b.earnedAt, month: b.month, by: b.by || '', note: b.note || '', revoked: b.state === 'revoked' };
  });
  log_(u, 'game', 'Bal yoxlamasına baxdı', s.name);
  return { audit: {
    student: { id: s.id, name: s.name, login: s.login, status: s.status || 'active', hidden: isTrue_(s.noRank) },
    total: o.total, level: levelOf_(o.total), streak: o.streak, maxStreak: o.maxStreak, att: o.att, fullMonths: o.fullMonths, exams: o.exams,
    months: mlist, events: o.ev.slice().reverse().slice(0, 300), badges: BADGES.map(function (b) { return badgeView_(b, earned[b.id], o, share); }), log: log,
    rules: gameRules_()
  } };
}
function gameBadge_(u, req) {
  needSuper_(u);
  var s = mustStudent_(req.studentId);
  var b = BADGE_MAP[String(req.badge || '')];
  if (!b) throw fail_('Nişan tapılmadı.');
  if (b.season && req.op !== 'del' && req.op !== 'remove') throw fail_('Bayram nişanları yalnız bayram günü avtomatik verilir.');
  var note = reqStr_(req.note, 'Səbəb', 3, 160);
  var mine = badgeRows_().filter(function (r) { return r.studentId === s.id && r.badge === b.id; });
  var activeRows = mine.filter(function (r) { return r.state !== 'revoked'; });
  var stamp = now_();
  if (req.op === 'remove') {
    if (!activeRows.length) throw fail_('Tələbədə bu nişan yoxdur.');
    var last = activeRows.sort(function (a, c) { return a.earnedAt < c.earnedAt ? 1 : -1; })[0];
    update_('Badges', last, { state: 'revoked', note: note, by: u.name });
    log_(u, 'game', 'Nişanı geri aldı', s.name + ' · «' + b.name + '» · ' + note);
  } else {
    if (activeRows.length && !b.repeat) throw fail_('Tələbədə bu nişan artıq var.');
    var rev = mine.filter(function (r) { return r.state === 'revoked'; })[0];
    if (rev && !b.repeat) update_('Badges', rev, { state: '', earnedAt: stamp, by: u.name, note: note });
    else insertMany_('Badges', [{ id: newId_('B'), studentId: s.id, badge: b.id, earnedAt: stamp, month: '', by: u.name, note: note, state: '' }]);
    notify_([s.id], 'badge', 'Yeni nişan qazandın: «' + b.name + '»', 'sBadges', '');
    log_(u, 'game', 'Nişan verdi', s.name + ' · «' + b.name + '» · ' + note);
  }
  delete _raw['#game']; delete _raw['#bshare'];
  return {};
}
function gameRecalc_(u, req) {
  needSuper_(u);
  var ids = req.studentId ? [mustStudent_(req.studentId).id] : null;
  var snap = false;
  try { snap = ratingEnsure_(); } catch (e) { console.error(e); }
  var added = gameEval_(ids);
  log_(u, 'game', 'Balları yenidən hesabladı', (ids ? studentName_(ids[0]) : 'Bütün tələbələr') + ' · yeni nişan: ' + added + (snap ? ' · aylıq reytinq yekunlaşdı' : ''));
  return { added: added, snapshot: snap };
}
function setRankHidden_(u, req) {
  needSuper_(u);
  var s = mustStudent_(req.id);
  var on = !!req.hidden;
  update_('Students', s, { noRank: on ? 'true' : '' });
  log_(u, 'game', on ? 'Tələbəni ümumi reytinqdən gizlətdi' : 'Tələbəni ümumi reytinqdə göstərdi', s.name);
  delete _raw['#game'];
  return { hidden: on };
}
function setStudentStatus_(u, req) {
  need_(u, 'students.edit');
  var s = mustStudent_(req.id);
  var stt = ['active', 'left', 'grad'].indexOf(req.status) !== -1 ? req.status : '';
  if (!stt) throw fail_('Statusu seçin.');
  var cur = s.status || 'active';
  if (cur === stt) return {};
  var note = str_(req.note, 200);
  var LBL = { active: 'Aktiv', left: 'Ayrılıb', grad: 'Məzun' };
  var removed = [], closed = [], reopened = [];
  if (stt !== 'active') {
    var inC = rows_('Courses').filter(function (c) { return idList_(c.studentIds).indexOf(s.id) !== -1; });
    inC.forEach(function (c) {
      var rest = idList_(c.studentIds).filter(function (x) { return x !== s.id; });
      if (c.type === 'individual' || !rest.length) {
        update_('Courses', c, { deletedAt: now_(), deletedBy: u.id, closedAt: now_(), closedFor: s.id, updatedAt: now_() });
        closed.push(courseLabel_(c));
        if (c.teacherId && c.teacherId !== u.id) notify_([c.teacherId], 'course', '«' + courseLabel_(c) + '» məşğələsi bitdi: ' + s.name + ' ' + (stt === 'grad' ? 'məzun oldu' : 'kursdan ayrıldı') + '.', 'mine', '');
      } else {
        update_('Courses', c, { studentIds: rest.join(','), updatedAt: now_() });
        removed.push(courseLabel_(c));
      }
    });
    update_('Students', s, { status: stt, statusAt: now_(), statusNote: note, sessFrom: String(Date.now() + 1), updatedAt: now_() });
    sessDropFor_(s.id);
  } else {
    update_('Students', s, { status: 'active', statusAt: now_(), statusNote: note, updatedAt: now_() });
    rawRows_('Courses').filter(function (c) { return c.closedAt && c.closedFor === s.id && c.deletedAt; }).forEach(function (c) {
      update_('Courses', c, { deletedAt: '', deletedBy: '', closedAt: '', closedFor: '', updatedAt: now_() });
      reopened.push(courseLabel_(c));
    });
  }
  log_(u, 'student', stt === 'active' ? 'Tələbəni yenidən aktiv etdi' : 'Tələbənin statusunu dəyişdi',
    s.name + ' · ' + LBL[cur] + ' → ' + LBL[stt] + (removed.length ? ' · Məşğələlərdən çıxarıldı: ' + removed.join(', ') : '') +
    (closed.length ? ' · Bitmiş məşğələ: ' + closed.join(', ') : '') + (reopened.length ? ' · Yenidən açıldı: ' + reopened.join(', ') : '') + (note ? ' · ' + note : '') +
    (stt !== 'active' ? ' · Kabinetə giriş bağlandı, məlumatlar saxlanılır' : ' · Kabinetə giriş açıldı'));
  delete _raw['#game'];
  return { removed: removed, closed: closed, reopened: reopened };
}

function backupFolder_() {
  var it = DriveApp.getFoldersByName(BACKUP_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(BACKUP_FOLDER);
}
function backupNow_(why) {
  var ss = ss_();
  var folder = backupFolder_();
  var name = SCHOOL_NAME + ' — ehtiyat ' + Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH-mm') + (why ? ' (' + why + ')' : '');
  var copy = DriveApp.getFileById(ss.getId()).makeCopy(name, folder);
  var files = [], it = folder.getFiles();
  while (it.hasNext()) files.push(it.next());
  files.sort(function (a, b) { return b.getDateCreated().getTime() - a.getDateCreated().getTime(); });
  files.slice(BACKUP_KEEP).forEach(function (f) { f.setTrashed(true); });
  settingSet_('backup', { last: now_(), url: copy.getUrl(), name: name, folder: folder.getUrl() });
  return { name: name, url: copy.getUrl(), folder: folder.getUrl() };
}
function weeklyBackup() {
  job_('weeklyBackup', function () {
    try {
      var r = backupNow_('');
      log_(null, 'system', 'Həftəlik ehtiyat nüsxə çıxarıldı', r.name);
    } catch (e) {
      jobErr_(e, 'ehtiyat nüsxə');
      log_(null, 'system', 'Ehtiyat nüsxə alınmadı', String(e && e.message || e));
    }
  });
}
function backupRoute_(u, req) {
  if (u.role !== 'developer' && u.role !== 'superadmin') throw fail_('İcazə yoxdur.', 'PERM');
  if (req.run) {
    if (u._readOnly) throw fail_('İcazə yoxdur.', 'PERM');
    var r = backupNow_('əl ilə');
    log_(u, u.role === 'developer' ? 'dev' : 'system', 'Ehtiyat nüsxə çıxardı', r.name);
  }
  var b = settingGet_('backup') || {};
  return { backup: { last: b.last || '', url: b.url || '', name: b.name || '', folder: b.folder || '', keep: BACKUP_KEEP } };
}
function cleanupDaily_() {
  var cut = Date.now() - NOTIF_KEEP_DAYS * 864e5, n = 0, a = 0;
  var old = rawRows_('Notifs').filter(function (x) { return x.readAt && stampMs_(x.readAt) < cut; });
  if (old.length) { removeRows_('Notifs', old.map(function (x) { return x._row; })); n = old.length; }
  var anns = {};
  rawRows_('Anns').forEach(function (x) { if (isTrue_(x.active)) anns[x.id] = true; });
  var seen = rawRows_('AnnSeen').filter(function (x) { return !anns[x.annId]; });
  if (seen.length) { removeRows_('AnnSeen', seen.map(function (x) { return x._row; })); a = seen.length; }
  var ecut = Date.now() - ERR_KEEP_DAYS * 864e5;
  var errs = rawRows_('Errors').filter(function (x) { return stampMs_(x.lastAt) < ecut; });
  if (errs.length) removeRows_('Errors', errs.map(function (x) { return x._row; }));
  return { notifs: n, annSeen: a, errors: errs.length };
}
function stampMs_(s) {
  var t = new Date(String(s).replace(' ', 'T') + TZ_OFFSET).getTime();
  return isNaN(t) ? 0 : t;
}

function studentLogins_(u, req) {
  var ids, title;
  if (req.courseId) {
    var c = mustCourse_(req.courseId);
    if (!(u.role === 'superadmin' || can_(u, 'students.reset') || c.teacherId === u.id)) throw fail_('Bu məşğələnin giriş məlumatlarına baxmaq üçün icazəniz yoxdur.', 'PERM');
    ids = idList_(c.studentIds);
    title = courseLabel_(c);
  } else {
    need_(u, 'students.reset');
    ids = rows_('Students').filter(isActiveSt_).map(function (s) { return s.id; });
    title = 'Bütün tələbələr';
  }
  var list = ids.map(findStudent_).filter(isActiveSt_).map(function (s) {
    return { id: s.id, name: s.name, login: s.login, fresh: isTrue_(s.mustChange), seen: !!s.lastSeen, canReset: canResetFor_(u, s.id) };
  }).sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  log_(u, 'view', 'Tələbələrin giriş məlumatlarına baxdı', title);
  return { title: title, password: STUDENT_PASSWORD, list: list };
}
function resetStudentPassword_(u, req) {
  var s = mustStudent_(req.id);
  if (!isActiveSt_(s)) throw fail_('Bu tələbə kursu tərk edib. Əvvəlcə onu yenidən aktiv edin.');
  if (!canResetFor_(u, s.id)) throw fail_('Yalnız öz tələbələrinizin şifrəsini sıfırlaya bilərsiniz.', 'PERM');
  var ch = { password: makePw_(STUDENT_PASSWORD), mustChange: 'true', sessFrom: String(Date.now() + 1), updatedAt: now_() };
  if (!s.login) ch.login = studentLoginFor_(s.name, takenLogins_());
  update_('Students', s, ch);
  sessDropFor_(s.id);
  log_(u, 'student', 'Tələbənin şifrəsini sıfırladı', s.name + ' · Login: ' + s.login);
  return { login: s.login, password: STUDENT_PASSWORD, name: s.name };
}

var EXAM_END = { submit: 'tələbə özü bitirdi', time: 'vaxt bitdi', violations: 'qayda pozuntularına görə dayandırıldı' };
var EXAM_VKINDS = { leave: 1, copy: 1, paste: 1, shot: 1, print: 1, other: 1 };

function parseJson_(s, fb) {
  if (s === '' || s === null || s === undefined) return fb;
  try { var v = JSON.parse(s); return v === null || v === undefined ? fb : v; } catch (e) { return fb; }
}
function range_(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
function shuffle_(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function num_(v) { var n = Number(v); return isFinite(n) ? n : 0; }
function pts_(v) { var n = Number(String(v).replace(',', '.')); return isFinite(n) ? Math.round(n * 2) / 2 : NaN; }
function pct_(score, max) { max = num_(max); return max > 0 ? Math.round(num_(score) / max * 100) : 0; }
function msToStamp_(ms) { return Utilities.formatDate(new Date(ms), TIMEZONE, 'yyyy-MM-dd HH:mm:ss'); }

function chunks_(s) {
  var out = [], i = 0;
  while (i < s.length && out.length < 3) {
    var end = Math.min(s.length, i + EXAM_CHUNK);
    if (end < s.length) {
      var guard = 0;
      while (guard++ < 40 && end > i + 1) {
        var prev = s.charCodeAt(end - 1), next = s.charAt(end);
        if ((prev >= 0xD800 && prev <= 0xDBFF) || next === "'" || next === '=') end--; else break;
      }
    }
    out.push(s.slice(i, end)); i = end;
  }
  if (i < s.length) return null;
  while (out.length < 3) out.push('');
  return out;
}
function bigPut_(prefix, value, what) {
  var c = chunks_(JSON.stringify(value));
  if (!c) throw fail_((what || 'Mətn') + ' həddən artıq böyükdür. Zəhmət olmasa, qısaldın.');
  var o = {}; o[prefix] = c[0]; o[prefix + '2'] = c[1]; o[prefix + '3'] = c[2];
  return o;
}

function answersPut_(ans) {
  var guard = 0;
  while (guard++ < 60 && JSON.stringify(ans).length > EXAM_CHUNK * 3 - 3000) {
    var longest = null;
    Object.keys(ans).forEach(function (k) { if (typeof ans[k] === 'string' && (longest === null || ans[k].length > ans[longest].length)) longest = k; });
    if (longest === null) break;
    ans[longest] = ans[longest].slice(0, Math.max(200, Math.floor(ans[longest].length * 0.6)));
  }
  return bigPut_('answers', ans, 'Cavablar');
}
function bigGet_(row, prefix, fb) {
  var s = String(row[prefix] || '') + String(row[prefix + '2'] || '') + String(row[prefix + '3'] || '');
  return parseJson_(s, fb);
}

function examIndex_() {
  if (_raw['ExamResults#idx']) return _raw['ExamResults#idx'];
  var m = meta_('ExamResults'), out = [];
  if (m.head[0] !== 'id' || m.head[1] !== 'examId' || m.head[2] !== 'status' || m.head[3] !== 'studentId') {
    out = rawRows_('ExamResults').map(function (r) { return { _row: r._row, id: r.id, examId: r.examId, status: r.status, studentId: r.studentId }; });
  } else {
    var last = m.sh.getLastRow();
    if (last >= 2) {
      var v = m.sh.getRange(2, 1, last - 1, 4).getValues();
      for (var i = 0; i < v.length; i++) {
        if (v[i][0] === '' || v[i][0] == null) continue;
        out.push({ _row: i + 2, id: String(v[i][0]), examId: String(v[i][1]), status: String(v[i][2]), studentId: String(v[i][3]) });
      }
    }
  }
  _raw['ExamResults#idx'] = out;
  return out;
}
function examFresh_() { delete _raw.Exams; delete _raw.ExamResults; delete _raw['ExamResults#idx']; }
function attemptFull_(id) {
  var e = examIndex_().filter(function (x) { return x.id === String(id); })[0];
  return e ? fullRowAt_('ExamResults', e._row) : null;
}
function resPatch_(a, changes) {
  setCells_('ExamResults', a._row, changes);
  Object.keys(changes).forEach(function (k) { a[k] = changes[k]; });
  delete _raw.ExamResults; delete _raw['ExamResults#idx'];
}
function examAny_(id) { return rawRows_('Exams').filter(function (x) { return x.id === String(id); })[0] || null; }
function mustExam_(id) {
  var e = rows_('Exams').filter(function (x) { return x.id === String(id); })[0];
  if (!e) throw fail_('İmtahan tapılmadı. Səhifəni yeniləyin.', 'NOTFOUND');
  return e;
}
function examQuestionsOf_(ex) { return bigGet_(fullRowAt_('Exams', ex._row), 'questions', []); }
function examHasAttempts_(examId) { return examIndex_().some(function (x) { return x.examId === examId; }); }
function examKey_() { return Utilities.getUuid().replace(/-/g, '').slice(0, 12); }
function examAccess_(u, ex, level) {
  if (level !== 'delete' && ex.teacherId === u.id) return true;
  return can_(u, 'exams.' + level);
}
function needExam_(u, ex, level) {
  if (!examAccess_(u, ex, level)) throw fail_('Bu imtahan üçün icazəniz yoxdur.', 'PERM');
}
function canCreateExam_(u) {
  if (can_(u, 'exams.manage')) return true;
  if (u.role === 'developer' || u.role === 'helper') return false;
  return u.role === 'teacher' || rows_('Courses').some(function (c) { return c.teacherId === u.id; });
}

function examPool_(u) {
  if (can_(u, 'exams.manage')) return null;
  var ok = {};
  rows_('Courses').forEach(function (c) { if (c.teacherId === u.id) idList_(c.studentIds).forEach(function (id) { ok[id] = true; }); });
  return ok;
}

function examQuestions_(req, defPts) {
  var inQ = Array.isArray(req.questions) ? req.questions : [];
  if (!inQ.length) throw fail_('Ən azı bir sual əlavə edin.');
  if (inQ.length > EXAM_MAX_Q) throw fail_('Bir imtahanda ən çoxu ' + EXAM_MAX_Q + ' sual ola bilər.');
  var out = [], max = 0, open = 0;
  inQ.forEach(function (q, i) {
    var n = 'Sual ' + (i + 1) + ': ';
    q = q || {};
    var text = String(q.q === undefined || q.q === null ? '' : q.q).replace(/\r/g, '').trim().slice(0, 2000);
    if (!text) throw fail_(n + 'mətn boşdur.');
    var p = q.p === undefined || q.p === null || q.p === '' ? defPts : pts_(q.p);
    if (!(p > 0 && p <= 100)) throw fail_(n + 'bal 0.5–100 aralığında olmalıdır.');
    if (q.t === 'o') {
      out.push({ t: 'o', q: text, a: String(q.a || '').replace(/\r/g, '').trim().slice(0, 2000), p: p });
      open++;
    } else {
      var opts = (Array.isArray(q.o) ? q.o : []).map(function (x) { return String(x === null || x === undefined ? '' : x).replace(/\s+/g, ' ').trim().slice(0, 500); });
      if (opts.length < 2 || opts.length > 8) throw fail_(n + 'variantların sayı 2–8 olmalıdır.');
      if (opts.some(function (x) { return !x; })) throw fail_(n + 'boş variant var.');
      var c = q.c === '' || q.c === null || q.c === undefined ? -1 : Math.floor(Number(q.c));
      if (!(c >= 0 && c < opts.length)) throw fail_(n + 'düzgün cavab işarələnməyib.');
      out.push({ t: 't', q: text, o: opts, c: c, p: p });
    }
    max += p;
  });
  return { list: out, max: Math.round(max * 100) / 100, open: open };
}

function examLight_(e, st, u) {
  var mine = e.teacherId === u.id;
  return {
    id: e.id, title: e.title, subject: e.subject, teacherId: e.teacherId, teacherName: userName_(e.teacherId),
    students: idList_(e.studentIds).length, duration: num_(e.duration), points: num_(e.points), passMin: num_(e.passMin), maxPoints: num_(e.maxPoints),
    qCount: num_(e.qCount), openCount: num_(e.openCount), strict: isTrue_(e.strict), stopOnLimit: isTrue_(e.stopOnLimit),
    shuffle: isTrue_(e.shuffle), reveal: isTrue_(e.reveal), active: isTrue_(e.active), locked: isTrue_(e.locked),
    createdAt: e.createdAt, updatedAt: e.updatedAt, isTest: isTrue_(e.isTest),
    mine: mine, canManage: !u._readOnly && (mine || can_(u, 'exams.manage')),
    canDelete: !u._readOnly && (can_(u, 'exams.delete') || (mine && !isTrue_(e.locked))),
    stats: st || { attempts: 0, students: 0, avg: null, pending: 0, running: 0, passed: 0, last: '' }
  };
}
function attemptLight_(a, ex, nameOf) {
  var fin = a.status !== 'started', score = num_(a.score), pm = num_(a.passMin);
  var pass = null;
  if (fin && pm > 0) pass = score >= pm ? true : (a.status === 'done' ? false : null);
  return {
    id: a.id, examId: a.examId, title: ex ? ex.title : '(silinmiş imtahan)', subject: ex ? ex.subject : '',
    studentId: a.studentId, studentName: nameOf ? nameOf(a.studentId) : '',
    status: a.status, startedAt: a.startedAt, finishedAt: a.finishedAt, spent: num_(a.spent), duration: num_(a.dur),
    score: fin ? score : null, maxPoints: num_(a.maxPoints), pct: fin ? pct_(score, a.maxPoints) : null, passMin: pm, pass: pass,
    pending: num_(a.openPending), violations: num_(a.violations), endReason: a.endReason, late: num_(a.late), marks: a.marks || ''
  };
}
function examStatsMap_(rows) {
  var map = {};
  rows.forEach(function (a) {
    var s = map[a.examId] || (map[a.examId] = { attempts: 0, students: 0, avg: null, pending: 0, running: 0, passed: 0, last: '', _sum: 0, _n: 0, _st: {} });
    if (a.status === 'started') { s.running++; return; }
    s.attempts++; s._st[a.studentId] = true;
    if (a.status === 'review') s.pending++;
    else { s._sum += pct_(a.score, a.maxPoints); s._n++; }
    if (num_(a.passMin) > 0 && num_(a.score) >= num_(a.passMin)) s.passed++;
    if (a.finishedAt > s.last) s.last = a.finishedAt;
  });
  Object.keys(map).forEach(function (k) { var s = map[k]; s.students = Object.keys(s._st).length; s.avg = s._n ? Math.round(s._sum / s._n) : null; delete s._sum; delete s._n; delete s._st; });
  return map;
}

function examPending_(u) {
  var rev = examIndex_().filter(function (x) { return x.status === 'review'; });
  if (!rev.length) return 0;
  var own = {}; rows_('Exams').forEach(function (e) { if (e.teacherId === u.id) own[e.id] = true; });
  return rev.filter(function (x) { return own[x.examId]; }).length;
}

function examsOfStudent_(sid, uMap) {
  if (!examIndex_().some(function (x) { return x.studentId === sid && x.status !== 'started'; })) return { list: [], avg: null, count: 0 };
  var exMap = {}; rows_('Exams').forEach(function (e) { exMap[e.id] = e; });
  var list = rawRows_('ExamResults').filter(function (a) { return a.studentId === sid && a.status !== 'started' && exMap[a.examId]; })
    .map(function (a) { var o = attemptLight_(a, exMap[a.examId], null); o.teacherName = uMap && uMap[exMap[a.examId].teacherId] ? uMap[exMap[a.examId].teacherId].name : userName_(exMap[a.examId].teacherId); delete o.marks; return o; })
    .sort(function (a, b) { return a.finishedAt < b.finishedAt ? 1 : -1; });
  var done = list.filter(function (x) { return x.status === 'done'; });
  var avg = done.length ? Math.round(done.reduce(function (s, x) { return s + x.pct; }, 0) / done.length) : null;
  return { list: list, avg: avg, count: list.length };
}

function examList_(u, req) {
  var all = can_(u, 'exams.view');
  var create = canCreateExam_(u);
  if (!all && !create && !rows_('Exams').some(function (e) { return e.teacherId === u.id; })) throw fail_('İmtahanlar bölməsi üçün icazəniz yoxdur.', 'PERM');

  if (examIndex_().some(function (x) { return x.status === 'started'; })) {
    try { withLock_(function () { examFresh_(); examCloseExpired_(null); }); } catch (e) {}
    examFresh_();
  }
  var exams = rows_('Exams').filter(function (e) { return all || e.teacherId === u.id; });
  var ids = {}; exams.forEach(function (e) { ids[e.id] = true; });
  var stats = examStatsMap_(exams.length && examIndex_().length ? rawRows_('ExamResults').filter(function (a) { return ids[a.examId]; }) : []);
  var list = exams.map(function (e) { return examLight_(e, stats[e.id], u); })
    .sort(function (a, b) { return (a.updatedAt || a.createdAt) < (b.updatedAt || b.createdAt) ? 1 : -1; });
  var tMap = {}; list.forEach(function (e) { tMap[e.teacherId] = e.teacherName; });
  return { exams: list, canCreate: create && !u._readOnly, all: all,
    teachers: Object.keys(tMap).map(function (k) { return { id: k, name: tMap[k] }; }).sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); }) };
}

function examGet_(u, req) {
  var ex = mustExam_(req.id);
  needExam_(u, ex, 'view');
  examCloseExpired_(ex.id);
  ex = mustExam_(req.id);
  var qs = examQuestionsOf_(ex);
  var sMap = {}; rows_('Students').forEach(function (s) { sMap[s.id] = s; });
  var keys = parseJson_(ex.keys, {});
  var canManage = examAccess_(u, ex, 'manage');
  var students = idList_(ex.studentIds).map(function (id) {
    var s = sMap[id];
    var o = { id: id, name: s ? s.name : '(silinmiş tələbə)', gone: !s, key: canManage ? (keys[id] || '') : '' };
    return o;
  });
  var rows = examIndex_().some(function (x) { return x.examId === ex.id; }) ? rawRows_('ExamResults').filter(function (a) { return a.examId === ex.id; }) : [];
  var nameOf = function (id) { return sMap[id] ? sMap[id].name : '(silinmiş tələbə)'; };
  var attempts = rows.map(function (a) { return attemptLight_(a, ex, nameOf); })
    .sort(function (a, b) { return (a.finishedAt || a.startedAt) < (b.finishedAt || b.startedAt) ? 1 : -1; });

  var qstats = qs.map(function () { return { ok: 0, bad: 0, empty: 0, open: 0 }; });
  attempts.forEach(function (a) {
    if (a.status === 'started') return;
    for (var i = 0; i < qs.length; i++) {
      var ch = a.marks.charAt(i);
      if (ch === '1') qstats[i].ok++; else if (ch === '0') qstats[i].bad++; else if (ch === '-' || ch === 'e') qstats[i].empty++; else if (ch) qstats[i].open++;
    }
  });
  attempts.forEach(function (a) { delete a.marks; });
  var light = examLight_(ex, examStatsMap_(rows)[ex.id], u);
  light.note = ex.note; light.studentIds = idList_(ex.studentIds);
  light.token = canManage ? ex.token : '';
  light.questions = qs;
  light.locked = rows.length > 0;
  light.canDelete = !u._readOnly && (can_(u, 'exams.delete') || (light.mine && !rows.length));
  if (req.first && ex.teacherId !== u.id) log_(u, 'view', 'İmtahana və nəticələrinə baxdı', '«' + ex.title + '» · Müəllim: ' + userName_(ex.teacherId));
  return { exam: light, students: students, attempts: attempts, qstats: qstats };
}

function examCond_(p) {
  return 'Müddət: ' + p.duration + ' dəq · Məhdudiyyətlər: ' + (p.strict === 'true' ? 'var' : 'yox') +
    (p.strict === 'true' ? ' · ' + EXAM_WARN_LIMIT + ' xəbərdarlıqdan sonra bitir: ' + (p.stopOnLimit === 'true' ? 'bəli' : 'xeyr') : '');
}

function saveExam_(u, req) {
  var old = req.id ? mustExam_(req.id) : null;
  if (old) needExam_(u, old, 'manage');
  else if (!canCreateExam_(u)) throw fail_('İmtahan yaratmaq üçün icazəniz yoxdur.', 'PERM');
  var locked = old ? examHasAttempts_(old.id) : false;
  var manageAll = can_(u, 'exams.manage');

  var p = {};
  p.title = reqStr_(req.title, 'İmtahanın adı', 2, 120);
  p.subject = str_(req.subject, 60);
  p.note = str_(req.note, 600);
  var dur = Math.floor(Number(req.duration));
  if (!(dur >= 5 && dur <= 300)) throw fail_('Müddət 5–300 dəqiqə aralığında olmalıdır.');
  p.duration = String(dur);
  p.strict = req.strict ? 'true' : 'false';
  p.stopOnLimit = req.strict && req.stopOnLimit ? 'true' : 'false';
  p.shuffle = req.shuffle ? 'true' : 'false';
  p.reveal = req.reveal === false ? 'false' : 'true';
  p.active = req.active === false ? 'false' : 'true';

  var teacherId = old ? old.teacherId : u.id;
  if (manageAll && req.teacherId) {
    var t = findUser_(req.teacherId);
    if (!t || (t.role !== 'teacher' && t.role !== 'superadmin')) throw fail_('Müəllim seçin.');
    teacherId = t.id;
  }
  p.teacherId = teacherId;

  var ids = (Array.isArray(req.studentIds) ? req.studentIds : []).map(String).filter(function (v, i, a) { return v && a.indexOf(v) === i; });
  if (!ids.length) throw fail_('Ən azı bir tələbə seçin.');
  if (ids.length > EXAM_MAX_STUDENTS) throw fail_('Bir imtahana ən çoxu ' + EXAM_MAX_STUDENTS + ' tələbə təyin etmək olar.');
  var pool = examPool_(u), had = old ? idList_(old.studentIds) : [];
  var sLive = {}; rows_('Students').forEach(function (s) { sLive[s.id] = true; });
  ids.forEach(function (id) {
    if (had.indexOf(id) !== -1) return;
    if (!sLive[id]) throw fail_('Seçilmiş tələbələrdən biri tapılmadı. Səhifəni yeniləyin.');
    if (pool && !pool[id]) throw fail_('Yalnız öz məşğələlərinizdəki tələbələri seçə bilərsiniz.', 'PERM');
  });
  p.studentIds = ids.join(',');
  var keys = old ? parseJson_(old.keys, {}) : {}, nk = {};
  ids.forEach(function (id) { nk[id] = keys[id] || examKey_(); });
  p.keys = JSON.stringify(nk);

  var heavy = null, qInfo = '';
  if (!locked) {
    var defPts = pts_(req.points === undefined || req.points === '' ? 1 : req.points);
    if (!(defPts > 0 && defPts <= 100)) throw fail_('Bir sualın balı 0.5–100 aralığında olmalıdır.');
    var q = examQuestions_(req, defPts);
    var pm = req.passMin === undefined || req.passMin === '' ? 0 : pts_(req.passMin);
    if (!(pm >= 0)) throw fail_('Keçid balı düzgün deyil.');
    if (pm > q.max) throw fail_('Keçid balı maksimum baldan (' + q.max + ') çox ola bilməz.');
    p.points = String(defPts); p.passMin = String(pm); p.maxPoints = String(q.max);
    p.qCount = String(q.list.length); p.openCount = String(q.open);
    heavy = bigPut_('questions', q.list, 'Sualların mətni');
    qInfo = q.list.length + ' sual (' + (q.list.length - q.open) + ' test, ' + q.open + ' açıq) · Maks. bal: ' + q.max + (pm ? ' · Keçid balı: ' + pm : '');
  } else if (req.questions !== undefined || (req.passMin !== undefined && pts_(req.passMin) !== num_(old.passMin)) || (req.points !== undefined && pts_(req.points) !== num_(old.points))) {

    var same = req.questions === undefined;
    if (!same) { try { same = JSON.stringify(examQuestions_(req, num_(old.points) || 1).list) === JSON.stringify(examQuestionsOf_(old)); } catch (e) { same = false; } }
    if (!same || (req.passMin !== undefined && pts_(req.passMin) !== num_(old.passMin)) || (req.points !== undefined && pts_(req.points) !== num_(old.points))) {
      throw fail_('Bu imtahanı artıq yerinə yetirən var: suallar, ballar və keçid balı dəyişdirilə bilməz. Fərqli suallar üçün imtahanın surətini çıxarın.', 'LOCKED');
    }
  }

  if (old) {
    var ch = [];
    if (old.title !== p.title) ch.push('Ad: «' + old.title + '» → «' + p.title + '»');
    if (String(old.subject || '') !== p.subject) ch.push('Fənn: «' + (old.subject || '—') + '» → «' + (p.subject || '—') + '»');
    if (String(old.note || '') !== p.note) ch.push('Qeyd dəyişdirildi');
    if (old.duration !== p.duration) ch.push('Müddət: ' + old.duration + ' → ' + p.duration + ' dəq');
    [['strict', 'Məhdudiyyətlər'], ['stopOnLimit', 'Xəbərdarlıqdan sonra bitmə'], ['shuffle', 'Qarışdırma'], ['reveal', 'Düzgün cavabların göstərilməsi'], ['active', 'Aktivlik']].forEach(function (x) {
      if ((isTrue_(old[x[0]]) ? 'true' : 'false') !== p[x[0]]) ch.push(x[1] + ': ' + (p[x[0]] === 'true' ? 'açıldı' : 'söndürüldü'));
    });
    if (old.teacherId !== p.teacherId) ch.push('Müəllim: ' + userName_(old.teacherId) + ' → ' + userName_(p.teacherId));
    var added = ids.filter(function (x) { return had.indexOf(x) === -1; }), removed = had.filter(function (x) { return ids.indexOf(x) === -1; });
    if (added.length) ch.push('Əlavə edilən tələbələr: ' + added.map(studentName_).join(', '));
    if (removed.length) ch.push('Çıxarılan tələbələr: ' + removed.map(studentName_).join(', '));
    if (heavy) {
      if (old.qCount !== p.qCount || old.maxPoints !== p.maxPoints || old.passMin !== p.passMin || old.points !== p.points) ch.push('Suallar: ' + qInfo);
      else if (JSON.stringify(examQuestionsOf_(old)) !== JSON.stringify(bigGet_(heavy, 'questions', []))) ch.push('Sualların mətni dəyişdirildi');
    }
    p.updatedAt = now_();
    var prevTeacher = old.teacherId, title0 = old.title;
    var all = {}; Object.keys(p).forEach(function (k) { all[k] = p[k]; });
    if (heavy) Object.keys(heavy).forEach(function (k) { all[k] = heavy[k]; });
    update_('Exams', old, all);
    log_(u, 'exam', 'İmtahanı redaktə etdi', '«' + title0 + '» — ' + (ch.join('; ') || 'dəyişiklik edilmədi'));
    if (prevTeacher !== u.id && findUser_(prevTeacher) && ch.length) notify_([prevTeacher], 'exam', u.name + ' «' + p.title + '» imtahanınızı redaktə etdi.', 'exams', old.id);
    if (p.teacherId !== prevTeacher && p.teacherId !== u.id) notify_([p.teacherId], 'exam', 'Sizə imtahan təyin edildi: «' + p.title + '»', 'exams', old.id);
    if (p.active === 'true') notify_(added, 'exam', 'Sənə yeni imtahan təyin edildi: «' + p.title + '»', 'sExams', old.id);
    return { id: old.id, locked: locked };
  }

  var row = { id: newId_('E'), token: Utilities.getUuid().replace(/-/g, '').slice(0, 24), locked: 'false', createdBy: u.id, createdAt: now_(), updatedAt: '', deletedAt: '', deletedBy: '', isTest: '' };
  Object.keys(p).forEach(function (k) { row[k] = p[k]; });
  Object.keys(heavy).forEach(function (k) { row[k] = heavy[k]; });
  insertMany_('Exams', [row]);
  log_(u, 'exam', 'İmtahan yaratdı', '«' + row.title + '» · Müəllim: ' + userName_(row.teacherId) + ' · ' + qInfo + ' · ' + examCond_(p) + ' · Tələbə sayı: ' + ids.length);
  if (row.teacherId !== u.id) notify_([row.teacherId], 'exam', u.name + ' sizin üçün imtahan yaratdı: «' + row.title + '»', 'exams', row.id);
  if (row.active === 'true') notify_(ids, 'exam', 'Sənə yeni imtahan təyin edildi: «' + row.title + '»', 'sExams', row.id);
  return { id: row.id, locked: false };
}

function setExamActive_(u, req) {
  var ex = mustExam_(req.id);
  needExam_(u, ex, 'manage');
  var on = !!req.active;
  if (isTrue_(ex.active) !== on) {
    update_('Exams', ex, { active: on ? 'true' : 'false', updatedAt: now_() });
    log_(u, 'exam', on ? 'İmtahanı açdı' : 'İmtahanı bağladı', '«' + ex.title + '»' + (on ? ' · link yenidən işləyir' : ' · link artıq yeni cəhd qəbul etmir'));
    if (ex.teacherId !== u.id && findUser_(ex.teacherId)) notify_([ex.teacherId], 'exam', u.name + ' «' + ex.title + '» imtahanını ' + (on ? 'açdı.' : 'bağladı.'), 'exams', ex.id);
  }
  return { active: on };
}

function copyExam_(u, req) {
  var ex = mustExam_(req.id);
  needExam_(u, ex, 'manage');
  if (!canCreateExam_(u)) throw fail_('İmtahan yaratmaq üçün icazəniz yoxdur.', 'PERM');
  var full = fullRowAt_('Exams', ex._row);
  var keys = {}; idList_(ex.studentIds).forEach(function (id) { keys[id] = examKey_(); });
  var row = {};
  SCHEMA.Exams.forEach(function (h) { row[h] = full[h]; });
  row.id = newId_('E'); row.token = Utilities.getUuid().replace(/-/g, '').slice(0, 24);
  row.title = (String(ex.title).slice(0, 110) + ' (surət)');
  row.keys = JSON.stringify(keys); row.locked = 'false'; row.active = 'true';
  row.createdBy = u.id; row.createdAt = now_(); row.updatedAt = ''; row.deletedAt = ''; row.deletedBy = ''; row.isTest = '';
  insertMany_('Exams', [row]);
  log_(u, 'exam', 'İmtahanın surətini çıxardı', '«' + ex.title + '» → «' + row.title + '»');
  return { id: row.id };
}

function deleteExam_(u, req) {
  var ex = mustExam_(req.id);
  var has = examHasAttempts_(ex.id);

  if (has || ex.teacherId !== u.id) need_(u, 'exams.delete');
  update_('Exams', ex, { deletedAt: now_(), deletedBy: u.id });
  log_(u, 'exam', 'İmtahanı sildi', '«' + ex.title + '» · Müəllim: ' + userName_(ex.teacherId) + ' · Zibil qutusuna köçürüldü' + (has ? ' (nəticələri ilə birlikdə)' : ''));
  if (ex.teacherId !== u.id && findUser_(ex.teacherId)) notify_([ex.teacherId], 'exam', '«' + ex.title + '» imtahanı silindi.', 'exams', '');
  return {};
}

function examNewLinks_(u, req) {
  var ex = mustExam_(req.id);
  needExam_(u, ex, 'manage');
  var keys = {}; idList_(ex.studentIds).forEach(function (id) { keys[id] = examKey_(); });
  update_('Exams', ex, { token: Utilities.getUuid().replace(/-/g, '').slice(0, 24), keys: JSON.stringify(keys), updatedAt: now_() });
  log_(u, 'exam', 'İmtahan linklərini yenilədi', '«' + ex.title + '» · köhnə linklər artıq işləmir');
  return {};
}

function examPurgeResults_(examIds) {
  var set = {}; examIds.forEach(function (id) { set[id] = true; });
  var rows = examIndex_().filter(function (x) { return set[x.examId]; });
  if (rows.length) removeRows_('ExamResults', rows.map(function (x) { return x._row; }));
  return rows.length;
}

function examCheck_(issues, sIds) {
  var exams = rows_('Exams');
  if (!exams.length) return;
  var uIds = {}; rows_('Users').forEach(function (x) { uIds[x.id] = true; });
  exams.forEach(function (e) {
    if (!uIds[e.teacherId]) issues.push({ type: 'warn', text: '«' + e.title + '» imtahanının müəllimi silinib.' });
    var gone = idList_(e.studentIds).filter(function (id) { return !sIds[id]; }).length;
    if (gone) issues.push({ type: 'info', text: '«' + e.title + '» imtahanında silinmiş tələbə var (' + gone + ').' });
  });
  var rev = examIndex_().filter(function (x) { return x.status === 'review'; }).length;
  if (rev) issues.push({ type: 'info', text: rev + ' imtahan cavabı müəllimin yoxlamasını gözləyir (açıq suallar).' });
}

function resultView_(ex, qs, a, staff) {
  var ans = bigGet_(a, 'answers', {}) || {}, grades = parseJson_(a.grades, {}) || {};
  var reveal = staff || isTrue_(ex.reveal);
  var counts = { ok: 0, bad: 0, empty: 0, open: 0 };
  var fin = a.status !== 'started';
  var items = qs.map(function (q, i) {
    var v = ans[i];
    if (q.t === 't') {
      var chosen = v === undefined || v === null || v === '' ? null : Number(v);
      var ok = chosen === null ? null : chosen === q.c;
      if (ok === null) counts.empty++; else if (ok) counts.ok++; else counts.bad++;
      return { t: 't', q: q.q, p: q.p, o: q.o, chosen: chosen, ok: ok, correct: (reveal || ok) ? q.c : null, got: ok ? q.p : 0 };
    }
    var text = typeof v === 'string' ? v : '';
    var graded = grades[i] !== undefined && grades[i] !== null && grades[i] !== '';
    if (!text.trim()) counts.empty++; else counts.open++;
    return { t: 'o', q: q.q, p: q.p, answer: text, got: !text.trim() ? 0 : (graded ? num_(grades[i]) : null),
      model: (staff || (reveal && a.status === 'done')) ? q.a : '' };
  });
  var light = attemptLight_(a, ex, studentName_);
  delete light.marks;
  light.teacherName = userName_(ex.teacherId);
  light.autoScore = num_(a.autoScore); light.openScore = num_(a.openScore);
  light.comment = a.comment || ''; light.gradedAt = a.gradedAt || '';
  light.counts = counts; light.items = items; light.reveal = isTrue_(ex.reveal);
  light.strict = isTrue_(ex.strict); light.warnLimit = EXAM_WARN_LIMIT;
  if (staff) { light.vlog = parseJson_(a.vlog, []); light.gradedBy = a.gradedBy ? userName_(a.gradedBy) : ''; light.examDeleted = !!ex.deletedAt; }
  return light;
}

function examAttempt_(u, req) {
  var a = attemptFull_(req.id);
  if (!a) throw fail_('Nəticə tapılmadı. Səhifəni yeniləyin.', 'NOTFOUND');
  var ex = examAny_(a.examId);
  if (!ex) throw fail_('Bu nəticənin imtahanı silinib.', 'NOTFOUND');

  if (!examAccess_(u, ex, 'view') && !can_(u, 'students.view')) throw fail_('Bu nəticəyə baxmaq üçün icazəniz yoxdur.', 'PERM');
  if (a.status === 'started' && req._at > num_(a.deadline) + 60000) { finalize_(ex, examQuestionsOf_(ex), a, null, 'time', req._at, ''); a = attemptFull_(req.id); }
  var s = findStudent_(a.studentId);
  var view = resultView_(ex, examQuestionsOf_(ex), a, true);
  view.canGrade = !u._readOnly && examAccess_(u, ex, 'manage') && a.status !== 'started';
  view.canDelete = !u._readOnly && can_(u, 'exams.delete');
  if (s && can_(u, 'students.view')) view.parentName = s.parentName;
  if (ex.teacherId !== u.id) log_(u, 'view', 'İmtahan nəticəsinə baxdı', '«' + ex.title + '» · Tələbə: ' + (s ? s.name : '(silinmiş tələbə)'));
  return { attempt: view };
}

function gradeAttempt_(u, req) {
  var a = attemptFull_(req.id);
  if (!a) throw fail_('Nəticə tapılmadı. Səhifəni yeniləyin.', 'NOTFOUND');
  var ex = examAny_(a.examId);
  if (!ex || ex.deletedAt) throw fail_('Bu nəticənin imtahanı silinib.', 'NOTFOUND');
  needExam_(u, ex, 'manage');
  if (a.status === 'started') throw fail_('Bu cəhd hələ davam edir.');
  var qs = examQuestionsOf_(ex), ans = bigGet_(a, 'answers', {}) || {}, grades = parseJson_(a.grades, {}) || {};
  var inG = req.grades && typeof req.grades === 'object' ? req.grades : {};
  var marks = String(a.marks || '').split(''), openScore = 0, pending = 0;
  qs.forEach(function (q, i) {
    if (q.t !== 'o') return;
    var has = typeof ans[i] === 'string' && ans[i].trim();
    if (!has) { marks[i] = 'e'; delete grades[i]; return; }
    if (inG[i] !== undefined && inG[i] !== null && inG[i] !== '') {
      var g = pts_(inG[i]);
      if (!(g >= 0 && g <= q.p)) throw fail_('Sual ' + (i + 1) + ': bal 0–' + q.p + ' aralığında olmalıdır.');
      grades[i] = g;
    }
    if (grades[i] === undefined || grades[i] === null || grades[i] === '') { marks[i] = 'p'; pending++; }
    else { marks[i] = 'g'; openScore += num_(grades[i]); }
  });
  openScore = Math.round(openScore * 100) / 100;
  var score = Math.round((num_(a.autoScore) + openScore) * 100) / 100;
  var ch = { status: pending ? 'review' : 'done', openScore: String(openScore), score: String(score), openPending: String(pending), marks: marks.join(''),
    gradedBy: u.id, gradedAt: now_(), grades: JSON.stringify(grades) };
  if (req.comment !== undefined) ch.comment = str_(req.comment, 600);
  resPatch_(a, ch);
  log_(u, 'exam', 'Açıq cavabları yoxladı', '«' + ex.title + '» · Tələbə: ' + studentName_(a.studentId) + ' · Yekun: ' + score + '/' + a.maxPoints + (pending ? ' · yoxlanılmamış: ' + pending : ''));
  if (ex.teacherId !== u.id && findUser_(ex.teacherId)) notify_([ex.teacherId], 'exam', u.name + ' «' + ex.title + '» imtahanında ' + studentName_(a.studentId) + ' adlı tələbənin cavablarını yoxladı.', 'exams', ex.id);
  if (!pending && a.status === 'review') notify_([a.studentId], 'graded', '«' + ex.title + '» imtahanındakı cavabların yoxlanıldı: ' + score + '/' + a.maxPoints + ' bal', 'sExams', a.id);
  var view = resultView_(ex, qs, attemptFull_(a.id), true);
  view.canGrade = true; view.canDelete = can_(u, 'exams.delete');
  return { attempt: view };
}

function deleteAttempt_(u, req) {
  need_(u, 'exams.delete');
  var a = attemptFull_(req.id);
  if (!a) throw fail_('Nəticə tapılmadı. Səhifəni yeniləyin.', 'NOTFOUND');
  var ex = examAny_(a.examId);
  removeRows_('ExamResults', [a._row]);
  var cache = CacheService.getScriptCache(); cache.remove('xa_' + a.id); cache.remove('xd_' + a.id);
  if (ex && isTrue_(ex.locked) && !examHasAttempts_(ex.id)) update_('Exams', ex, { locked: 'false' });
  log_(u, 'exam', 'İmtahan cəhdini sildi', '«' + (ex ? ex.title : '(silinmiş imtahan)') + '» · Tələbə: ' + studentName_(a.studentId) + ' · ' + (a.status === 'started' ? 'davam edən cəhd' : 'Nəticə: ' + a.score + '/' + a.maxPoints) + ' · Tarix: ' + a.startedAt);
  if (ex && ex.teacherId !== u.id && findUser_(ex.teacherId)) notify_([ex.teacherId], 'exam', u.name + ' «' + ex.title + '» imtahanında ' + studentName_(a.studentId) + ' adlı tələbənin cəhdini sildi.', 'exams', ex.id);
  return {};
}

function examByLink_(link) {
  link = String(link || '').slice(0, 80);
  var bad = function () { return fail_('İmtahan tapılmadı. Link yanlışdır və ya artıq etibarsızdır.', 'NOTFOUND'); };
  var list = rows_('Exams');
  var m = link.match(/^([A-Za-z0-9]+)\.([A-Za-z0-9]+)$/);
  if (m) {
    var ex = list.filter(function (x) { return x.id === m[1]; })[0];
    if (!ex) throw bad();
    var keys = parseJson_(ex.keys, {}), sid = '';
    Object.keys(keys).forEach(function (k) { if (keys[k] === m[2]) sid = k; });
    if (!sid || idList_(ex.studentIds).indexOf(sid) === -1) throw bad();
    return { ex: ex, studentId: sid };
  }
  if (!/^[A-Za-z0-9]{12,}$/.test(link)) throw bad();
  var e2 = list.filter(function (x) { return x.token && x.token === link; })[0];
  if (!e2) throw bad();
  return { ex: e2, studentId: '' };
}
function examPublic_(ex) {
  return { title: ex.title, subject: ex.subject, note: ex.note, teacherName: userName_(ex.teacherId), duration: num_(ex.duration),
    qCount: num_(ex.qCount), openCount: num_(ex.openCount), maxPoints: num_(ex.maxPoints), passMin: num_(ex.passMin),
    strict: isTrue_(ex.strict), stopOnLimit: isTrue_(ex.stopOnLimit), warnLimit: EXAM_WARN_LIMIT };
}

function xInfo_(req) {
  var r = examByLink_(req.link), ex = r.ex;
  var out = { state: isTrue_(ex.active) ? 'open' : 'closed', exam: examPublic_(ex) };
  if (r.studentId) {
    var s = findStudent_(r.studentId);
    if (!s) throw fail_('İmtahan tapılmadı. Link yanlışdır və ya artıq etibarsızdır.', 'NOTFOUND');
    out.student = { id: s.id, name: s.name };
    var run = examIndex_().filter(function (x) { return x.examId === ex.id && x.studentId === s.id && x.status === 'started'; })[0];
    if (run) { var a = fullRowAt_('ExamResults', run._row); if (a.id === run.id && req._at <= num_(a.deadline)) { out.state = 'open'; out.running = Math.max(0, Math.round((num_(a.deadline) - req._at) / 1000)); } }
  } else {
    var sMap = {}; rows_('Students').forEach(function (x) { sMap[x.id] = x; });
    out.students = idList_(ex.studentIds).filter(function (id) { return sMap[id]; }).map(function (id) { return { id: id, name: sMap[id].name }; })
      .sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  }
  return out;
}

function cleanAnswers_(raw, n) {
  var out = {};
  if (!raw || typeof raw !== 'object') return out;
  Object.keys(raw).slice(0, 400).forEach(function (k) {
    var i = Number(k);
    if (!(i >= 0 && i < n) || Math.floor(i) !== i) return;
    var v = raw[k];
    if (typeof v === 'number' && isFinite(v) && v >= 0 && v < 20) out[i] = Math.floor(v);
    else if (typeof v === 'string') { var s = v.replace(/\r/g, '').slice(0, 3000); if (s.trim()) out[i] = s; }
  });
  return out;
}
function draftOf_(a) {
  var c = parseJson_(CacheService.getScriptCache().get('xd_' + a.id), null);
  if (c && c.a && typeof c.a === 'object') return c.a;
  var s = bigGet_(a, 'answers', null);
  return s && typeof s === 'object' ? s : null;
}
function attemptForStudent_(ex, qs, a, resumed) {
  var conf = parseJson_(a.conf, {}) || {};
  var order = Array.isArray(conf.o) && conf.o.length === qs.length ? conf.o : range_(qs.length);
  var list = order.map(function (i) {
    var q = qs[i], o = { i: i, t: q.t, q: q.q, p: q.p };
    if (q.t === 't') {
      var perm = conf.p && Array.isArray(conf.p[i]) && conf.p[i].length === q.o.length ? conf.p[i] : range_(q.o.length);
      o.o = perm.map(function (k) { return { v: k, x: q.o[k] }; });
    }
    return o;
  });
  var s = findStudent_(a.studentId);
  return { state: 'running',
    attempt: { id: a.id, left: Math.max(0, Math.round((num_(a.deadline) - Date.now()) / 1000)), duration: num_(a.dur), violations: num_(a.violations), resumed: !!resumed },
    exam: examPublic_(ex), student: { name: s ? s.name : '' }, questions: list, answers: (resumed ? draftOf_(a) : null) || {} };
}

function xStart_(req) {
  var r = examByLink_(req.link), ex = r.ex;
  var sid = r.studentId || String(req.studentId || '');
  if (!sid || idList_(ex.studentIds).indexOf(sid) === -1) throw fail_('Siyahıdan öz adınızı seçin.');
  return examStart_(ex, sid, !!req.accept, req._at);
}

function examStart_(ex, sid, accept, at) {
  var s = findStudent_(sid);
  if (!s) throw fail_('Tələbə tapılmadı. Müəlliminizə müraciət edin.', 'NOTFOUND');
  var mine = examIndex_().filter(function (x) { return x.examId === ex.id && x.studentId === sid; });
  var run = mine.filter(function (x) { return x.status === 'started'; })[0];
  var qs = examQuestionsOf_(ex);
  if (run) {
    var a = fullRowAt_('ExamResults', run._row);
    if (at <= num_(a.deadline) + EXAM_GRACE_SEC * 1000) return attemptForStudent_(ex, qs, a, true);
    finalize_(ex, qs, a, null, 'time', at, '');
    return { state: 'finished', resultId: a.id };
  }
  if (!isTrue_(ex.active)) return { state: 'closed', exam: examPublic_(ex) };
  if (!accept) throw fail_('İmtahana başlamaq üçün qaydaları qəbul edin.');
  if (!qs.length) throw fail_('Bu imtahanda sual yoxdur. Müəlliminizə müraciət edin.');
  if (mine.length >= EXAM_MAX_ATTEMPTS) throw fail_('Bu imtahan üçün cəhd limiti (' + EXAM_MAX_ATTEMPTS + ') bitib. Müəlliminizə müraciət edin.');
  var dur = num_(ex.duration) || 30, conf = {};
  if (isTrue_(ex.shuffle)) {
    conf.o = shuffle_(range_(qs.length)); conf.p = {};
    qs.forEach(function (q, i) { if (q.t === 't') conf.p[i] = shuffle_(range_(q.o.length)); });
  }
  var row = { id: 'R' + Utilities.getUuid().replace(/-/g, ''), examId: ex.id, status: 'started', studentId: sid, startedAt: msToStamp_(at), dur: String(dur),
    deadline: String(at + dur * 60000), finishedAt: '', spent: '', autoScore: '', openScore: '', score: '', maxPoints: ex.maxPoints, passMin: ex.passMin,
    openPending: '', violations: '0', endReason: '', late: '', marks: '', gradedBy: '', gradedAt: '', savedAt: '',
    comment: '', conf: JSON.stringify(conf), vlog: '[]', grades: '', answers: '', answers2: '', answers3: '' };
  insertMany_('ExamResults', [row]);
  if (!isTrue_(ex.locked)) update_('Exams', ex, { locked: 'true' });
  CacheService.getScriptCache().put('xa_' + row.id, JSON.stringify({ e: ex.id, d: at + dur * 60000, n: qs.length, s: 'started', p: at }), 21600);
  log_({ id: '', name: s.name, role: 'student' }, 'exam', 'İmtahana başladı', '«' + ex.title + '» · Müəllim: ' + userName_(ex.teacherId) + ' · Cəhd № ' + (mine.length + 1));
  return attemptForStudent_(ex, qs, row, false);
}

function attemptMeta_(id) {
  var cache = CacheService.getScriptCache();
  var m = parseJson_(cache.get('xa_' + id), null);
  if (m && m.d) return m;
  var a = attemptFull_(id);
  if (!a) return null;
  var ex = examAny_(a.examId);
  m = { e: a.examId, d: num_(a.deadline), n: ex ? (num_(ex.qCount) || EXAM_MAX_Q) : EXAM_MAX_Q, s: a.status, p: 0 };
  if (a.status === 'started') cache.put('xa_' + id, JSON.stringify(m), 21600);
  return m;
}

function xSave_(req) {
  var id = String(req.id || '').slice(0, 60), at = req._at;
  var meta = attemptMeta_(id);
  if (!meta) throw fail_('İmtahan cəhdi tapılmadı.', 'NOTFOUND');
  if (meta.s !== 'started') return { state: 'finished', resultId: id };
  if (at > meta.d + EXAM_GRACE_SEC * 1000) return { state: 'time' };
  var ans = cleanAnswers_(req.answers, meta.n);
  var json = JSON.stringify({ t: at, a: ans });
  var cache = CacheService.getScriptCache(), cached = false;
  if (json.length < 90000) { cache.put('xd_' + id, json, 21600); cached = true; }
  if (!cached || at - (meta.p || 0) > EXAM_PERSIST_SEC * 1000) {
    var still = true;
    withLock_(function () {
      examFresh_();
      var a = attemptFull_(id);
      if (!a || a.status !== 'started') { still = false; return; }
      var ch = answersPut_(ans); ch.savedAt = now_();
      setCells_('ExamResults', a._row, ch);
    });
    if (!still) { cache.remove('xa_' + id); return { state: 'finished', resultId: id }; }
    meta.p = at; cache.put('xa_' + id, JSON.stringify(meta), 21600);
  }
  return { state: 'ok', left: Math.max(0, Math.round((meta.d - Date.now()) / 1000)) };
}

function gradeAuto_(qs, ans) {
  var auto = 0, marks = '', pending = 0;
  qs.forEach(function (q, i) {
    var v = ans[i];
    if (q.t === 't') {
      if (v === undefined || v === null || v === '') marks += '-';
      else if (Number(v) === q.c) { marks += '1'; auto += q.p; }
      else marks += '0';
    } else if (typeof v === 'string' && v.trim()) { marks += 'p'; pending++; }
    else marks += 'e';
  });
  return { auto: Math.round(auto * 100) / 100, marks: marks, pending: pending };
}

function finalize_(ex, qs, a, answers, reason, at, lateMin) {
  var ans = answers || draftOf_(a) || {};
  var g = gradeAuto_(qs, ans);
  var dl = num_(a.deadline), startMs = dl - num_(a.dur) * 60000;
  var endMs = Math.max(startMs, Math.min(at, dl));
  var ch = answersPut_(ans);
  ch.status = g.pending ? 'review' : 'done';
  ch.finishedAt = msToStamp_(endMs);
  ch.spent = String(Math.max(0, Math.round((endMs - startMs) / 1000)));
  ch.autoScore = String(g.auto); ch.openScore = '0'; ch.score = String(g.auto);
  ch.openPending = String(g.pending); ch.endReason = reason; ch.late = lateMin || ''; ch.marks = g.marks; ch.savedAt = now_();
  resPatch_(a, ch);
  var cache = CacheService.getScriptCache(); cache.remove('xa_' + a.id); cache.remove('xd_' + a.id);
  var s = findStudent_(a.studentId), name = s ? s.name : '(silinmiş tələbə)';
  var res = g.auto + '/' + a.maxPoints + ' (' + pct_(g.auto, a.maxPoints) + '%)';
  log_({ id: '', name: name, role: 'student' }, 'exam', reason === 'violations' ? 'İmtahan qayda pozuntularına görə dayandırıldı' : 'İmtahanı bitirdi',
    '«' + ex.title + '» · Nəticə: ' + res + (g.pending ? ' · yoxlanılacaq açıq cavab: ' + g.pending : '') + ' · Səbəb: ' + (EXAM_END[reason] || reason) +
    (num_(a.violations) ? ' · Xəbərdarlıq sayı: ' + a.violations : '') + (lateMin ? ' · cavablar ' + lateMin + ' dəq gec göndərilib' : ''));
  examNotify_(ex, name + ' «' + ex.title + '» imtahanını bitirdi: ' + res + (g.pending ? ', açıq cavablar yoxlanılmalıdır' : '') + (reason === 'violations' ? ' (qayda pozuntularına görə dayandırıldı)' : ''));
}

function examNotify_(ex, text) {
  var uid = ex.teacherId;
  if (!uid || !findUser_(uid)) return;
  var open = rawRows_('Notifs').filter(function (n) { return n.userId === uid && n.type === 'exam' && n.param === ex.id && !n.readAt; })[0];
  if (!open) { notify_([uid], 'exam', text, 'exams', ex.id); return; }
  var m = String(open.text).match(/^(\d+) yeni nəticə/);
  update_('Notifs', open, { text: (m ? Number(m[1]) + 1 : 2) + ' yeni nəticə: «' + ex.title + '»', createdAt: now_() });
}

function examCloseExpired_(examId) {
  var started = examIndex_().filter(function (x) { return x.status === 'started' && (!examId || x.examId === examId); });
  var n = 0, now = Date.now();
  started.forEach(function (ent) {
    var a = fullRowAt_('ExamResults', ent._row);
    if (a.id !== ent.id || a.status !== 'started') return;
    if (now <= num_(a.deadline) + 60000) return;
    var ex = examAny_(a.examId);
    if (!ex) { resPatch_(a, { status: 'done', endReason: 'time', finishedAt: msToStamp_(num_(a.deadline)) }); return; }
    finalize_(ex, examQuestionsOf_(ex), a, null, 'time', now, '');
    n++;
  });
  return n;
}

function xEvent_(req) {
  var a = attemptFull_(String(req.id || '').slice(0, 60));
  if (!a) throw fail_('İmtahan cəhdi tapılmadı.', 'NOTFOUND');
  if (a.status !== 'started') return { state: 'finished', resultId: a.id };
  var ex = examAny_(a.examId);
  if (!ex) throw fail_('İmtahan tapılmadı.', 'NOTFOUND');
  var qs = examQuestionsOf_(ex), at = req._at;
  var ans = req.answers ? cleanAnswers_(req.answers, qs.length) : null;
  if (at > num_(a.deadline) + EXAM_GRACE_SEC * 1000) { finalize_(ex, qs, a, null, 'time', at, ''); return { state: 'finished', resultId: a.id }; }
  if (!isTrue_(ex.strict)) return { state: 'ok', violations: 0, limit: EXAM_WARN_LIMIT };
  var kind = EXAM_VKINDS[req.kind] ? String(req.kind) : 'other';
  var vlog = parseJson_(a.vlog, []) || [];
  if (vlog.length < 80) vlog.push([msToStamp_(at).slice(11), kind]);
  var n = num_(a.violations) + 1;
  var ch = { violations: String(n), vlog: JSON.stringify(vlog) };
  if (ans) { var big = answersPut_(ans); Object.keys(big).forEach(function (k) { ch[k] = big[k]; }); ch.savedAt = now_();
    var json = JSON.stringify({ t: at, a: ans }); if (json.length < 90000) CacheService.getScriptCache().put('xd_' + a.id, json, 21600); }
  resPatch_(a, ch);
  if (isTrue_(ex.stopOnLimit) && n > EXAM_WARN_LIMIT) {
    finalize_(ex, qs, a, ans, 'violations', at, '');
    return { state: 'finished', resultId: a.id, violations: n };
  }
  return { state: 'ok', violations: n, limit: EXAM_WARN_LIMIT, left: Math.max(0, Math.round((num_(a.deadline) - Date.now()) / 1000)) };
}

function xSubmit_(req) {
  var a = attemptFull_(String(req.id || '').slice(0, 60));
  if (!a) throw fail_('İmtahan cəhdi tapılmadı.', 'NOTFOUND');
  if (a.status !== 'started') return { state: 'finished', resultId: a.id };
  var ex = examAny_(a.examId);
  if (!ex) throw fail_('İmtahan tapılmadı.', 'NOTFOUND');
  var qs = examQuestionsOf_(ex), at = req._at, dl = num_(a.deadline);
  var ans = cleanAnswers_(req.answers, qs.length), reason = 'submit', lateMin = '';
  if (at > dl + EXAM_GRACE_SEC * 1000) {

    reason = 'time';
    var d = draftOf_(a);
    if (d) ans = d; else lateMin = String(Math.max(1, Math.round((at - dl) / 60000)));
  } else if (req.reason === 'time') reason = 'time';
  else if (req.reason === 'violations' && isTrue_(ex.strict) && isTrue_(ex.stopOnLimit)) {
    reason = 'violations';
    var v = Math.min(99, Math.floor(Number(req.violations) || 0));
    if (v > num_(a.violations)) resPatch_(a, { violations: String(Math.max(v, EXAM_WARN_LIMIT + 1)) });
  }
  finalize_(ex, qs, a, ans, reason, at, lateMin);
  return { state: 'finished', resultId: a.id };
}

function xResult_(req) {
  var id = String(req.id || '').slice(0, 60);
  var bad = function () { return fail_('Nəticə tapılmadı. Link yanlışdır.', 'NOTFOUND'); };
  if (!/^R[a-f0-9]{32}$/.test(id)) throw bad();
  var a = attemptFull_(id);
  if (!a) throw bad();
  var ex = examAny_(a.examId);
  if (!ex) throw bad();
  if (a.status === 'started') {
    if (req._at <= num_(a.deadline) + EXAM_GRACE_SEC * 1000) return { state: 'running' };
    withLock_(function () {
      examFresh_();
      var b = attemptFull_(id);
      if (b && b.status === 'started') { var e2 = examAny_(b.examId); if (e2) finalize_(e2, examQuestionsOf_(e2), b, null, 'time', req._at, ''); }
    });
    examFresh_();
    a = attemptFull_(id); ex = examAny_(a.examId);
    if (!a || !ex || a.status === 'started') throw bad();
  }
  return { state: 'done', result: resultView_(ex, examQuestionsOf_(ex), a, false) };
}

var TEST_EXAM_Q = [
  { t: 't', q: '12 × 8 neçədir?', o: ['86', '96', '108', '92'], c: 1, p: 2 },
  { t: 't', q: 'Azərbaycanın paytaxtı hansı şəhərdir?', o: ['Gəncə', 'Sumqayıt', 'Bakı', 'Şəki'], c: 2, p: 2 },
  { t: 't', q: '«Book» sözünün tərcüməsi hansıdır?', o: ['Dəftər', 'Kitab', 'Qələm'], c: 1, p: 2 },
  { t: 't', q: 'Suyun kimyəvi formulu hansıdır?', o: ['CO2', 'O2', 'H2O', 'NaCl'], c: 2, p: 2 },
  { t: 't', q: 'Bir saatda neçə dəqiqə var?', o: ['30', '60', '90', '100'], c: 1, p: 2 },
  { t: 'o', q: 'Bu ay keçdiyiniz mövzulardan birini qısa izah edin.', a: 'Mövzunun adı və 2–3 cümləlik izahı.', p: 5 }
];
function examTestRows_(teacherId, studentIds, creatorId, stamp, n) {
  var keys = {}; studentIds.forEach(function (id) { keys[id] = examKey_(); });
  var max = TEST_EXAM_Q.reduce(function (s, q) { return s + q.p; }, 0);
  var ex = { id: newId_('E'), token: Utilities.getUuid().replace(/-/g, '').slice(0, 24), title: 'Test imtahanı ' + n, subject: pick_(TEST_SUBJECTS), note: '',
    teacherId: teacherId, studentIds: studentIds.join(','), keys: JSON.stringify(keys), duration: '30', points: '2', passMin: '8', maxPoints: String(max),
    qCount: String(TEST_EXAM_Q.length), openCount: '1', strict: 'true', stopOnLimit: 'true', shuffle: 'false', reveal: 'true', active: 'true', locked: 'false',
    createdBy: creatorId, createdAt: stamp, updatedAt: '', deletedAt: '', deletedBy: '', isTest: 'true' };
  var big = bigPut_('questions', TEST_EXAM_Q); Object.keys(big).forEach(function (k) { ex[k] = big[k]; });
  var results = [];
  studentIds.forEach(function (sid, i) {
    if (i % 4 === 3) return;
    var ans = {}; TEST_EXAM_Q.forEach(function (q, k) { if (q.t === 't') { if (Math.random() < 0.9) ans[k] = Math.random() < 0.7 ? q.c : Math.floor(Math.random() * q.o.length); } else if (Math.random() < 0.8) ans[k] = 'Test cavabı: mövzunu öz sözlərimlə izah edirəm.'; });
    var g = gradeAuto_(TEST_EXAM_Q, ans), dur = 30, startMs = Date.now() - (i + 1) * 3600e3, spent = 600 + Math.floor(Math.random() * 1000);
    var stopped = i % 7 === 5;
    var row = { id: 'R' + Utilities.getUuid().replace(/-/g, ''), examId: ex.id, status: g.pending ? 'review' : 'done', studentId: sid, startedAt: msToStamp_(startMs), dur: String(dur),
      deadline: String(startMs + dur * 60000), finishedAt: msToStamp_(startMs + spent * 1000), spent: String(spent), autoScore: String(g.auto), openScore: '0', score: String(g.auto),
      maxPoints: String(max), passMin: '8', openPending: String(g.pending), violations: stopped ? '4' : String(i % 3), endReason: stopped ? 'violations' : 'submit', late: '', marks: g.marks,
      gradedBy: '', gradedAt: '', savedAt: stamp, comment: '', conf: '{}', vlog: stopped ? '[["12:01:10","leave"],["12:03:42","copy"],["12:05:03","leave"],["12:06:30","leave"]]' : '[]', grades: '' };
    var b = bigPut_('answers', ans); Object.keys(b).forEach(function (k) { row[k] = b[k]; });
    results.push(row);
  });
  if (results.length) ex.locked = 'true';
  return { exam: ex, results: results };
}

var _jobErrs = null;
function jobErr_(e, where) {
  console.error(e);
  if (_jobErrs) _jobErrs.push((where ? where + ': ' : '') + String(e && e.message || e));
  try { logError_('job', where || '', String(e && e.message || e), String(e && e.stack || ''), ''); } catch (x) {}
}
function job_(name, fn) {
  var t0 = Date.now();
  _jobErrs = [];
  try { withLock_(fn); } catch (e) { jobErr_(e, name); }
  var errs = _jobErrs; _jobErrs = null;
  try {
    withLock_(function () {
      delete _raw.Settings;
      var j = settingGet_('jobs') || {};
      j[name] = { at: now_(), ok: !errs.length, ms: Date.now() - t0, msg: errs.slice(0, 3).join(' · ').slice(0, 400) };
      settingSet_('jobs', j);
    });
  } catch (e) { console.error(e); }
}

function errKey_(src, msg, where) { return sha_(src + '|' + where + '|' + msg).slice(0, 16); }
function logError_(src, where, msg, stack, who, ua) {
  msg = String(msg || '').slice(0, 500);
  if (!msg) return;
  where = String(where || '').slice(0, 200);
  var key = errKey_(src, msg, where), day = today_();
  var row = rawRows_('Errors').filter(function (x) { return x.key === key && String(x.lastAt).slice(0, 10) === day; })[0];
  if (row) {
    setCells_('Errors', row._row, { count: String(num_(row.count) + 1), lastAt: now_(), who: who || row.who });
    return;
  }
  insertMany_('Errors', [{ id: newId_('E'), key: key, src: src, where: where, msg: msg, stack: String(stack || '').slice(0, 1500),
    who: String(who || '').slice(0, 80), ua: String(ua || '').slice(0, 160), count: '1', at: now_(), lastAt: now_() }]);
  var all = rawRows_('Errors');
  if (all.length > ERR_KEEP) removeRows_('Errors', all.slice(0, all.length - ERR_KEEP).map(function (x) { return x._row; }));
}
function serverError_(req, err) {
  try {
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(3000)) return;
    try {
      _raw = {};
      logError_('server', String(req && req.action || ''), String(err && err.message || err), String(err && err.stack || ''), '', '');
      SpreadsheetApp.flush();
    } finally { lock.releaseLock(); }
  } catch (e) { console.error(e); }
}
function clientError_(req) {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get('errN') || 0);
  if (n >= ERR_RATE) return { skipped: true };
  cache.put('errN', String(n + 1), 60);
  var who = '';
  if (req.token) {
    var raw = cache.get('s_' + req.token), sess = raw && raw.charAt(0) === '{' ? parseJson_(raw, null) : null;
    if (sess) {
      var x = sess.k === 's' ? findStudent_(sess.u) : findUser_(sess.u);
      if (x) who = x.name + (sess.k === 's' ? ' (tələbə)' : ' (' + (ROLE_LABELS[x.role] || x.role) + ')');
    }
  }
  var where = str_(req.where, 200) + (req.ver ? ' · v' + str_(req.ver, 12) : '');
  logError_('client', where, str_(req.msg, 500), str_(req.stack, 1500), who, str_(req.ua, 160));
  return {};
}
function devErrors_(u, req) {
  if (u.role !== 'developer' && u.role !== 'superadmin') throw fail_('İcazə yoxdur.', 'PERM');
  if (req.clear) {
    devOnly_(u);
    var rows = rawRows_('Errors');
    if (rows.length) removeRows_('Errors', rows.map(function (x) { return x._row; }));
    log_(u, 'dev', 'Xəta jurnalını təmizlədi', rows.length + ' qeyd');
  }
  var list = rawRows_('Errors').map(function (x) {
    return { id: x.id, src: x.src, where: x.where, msg: x.msg, stack: u.role === 'developer' ? x.stack : '', who: x.who, ua: x.ua, count: num_(x.count) || 1, at: x.at, lastAt: x.lastAt };
  }).sort(function (a, b) { return a.lastAt < b.lastAt ? 1 : -1; }).slice(0, 200);
  return { errors: list };
}

function trigSig_() { return TRIGGERS.map(function (t) { return t.fn + '@' + t.when; }).join('|'); }
function installTriggers_(force) {
  var all = ScriptApp.getProjectTriggers();
  var known = {};
  TRIGGERS.forEach(function (t) { known[t.fn] = true; });
  ['ratingMonthly', 'gameDaily', 'purgeTrashDaily', 'autoArchiveQuarterly', 'weeklyBackup'].forEach(function (f) { known[f] = true; });
  var sigOld = settingGet_('trigSig'), sig = trigSig_();
  var redo = force || sigOld !== sig;
  var have = {}, removed = 0;
  all.forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (redo && known[fn]) { ScriptApp.deleteTrigger(t); removed++; }
    else if (have[fn]) { ScriptApp.deleteTrigger(t); removed++; }
    else have[fn] = true;
  });
  var created = [];
  TRIGGERS.forEach(function (t) {
    if (!have[t.fn]) { t.make(ScriptApp.newTrigger(t.fn)).create(); created.push(t.fn); }
  });
  if (sigOld !== sig) settingSet_('trigSig', sig);
  return created;
}
function triggersStatus_() {
  var have = {}, err = false;
  try { ScriptApp.getProjectTriggers().forEach(function (t) { have[t.getHandlerFunction()] = (have[t.getHandlerFunction()] || 0) + 1; }); }
  catch (e) { err = true; }
  var jobs = settingGet_('jobs') || {};
  var sigOk = settingGet_('trigSig') === trigSig_();
  return TRIGGERS.map(function (t) {
    return { fn: t.fn, label: t.label, when: t.when, on: err ? null : !!have[t.fn], dup: (have[t.fn] || 0) > 1, sigOk: sigOk, last: jobs[t.fn] || null };
  });
}

function devHealth_(u, req) {
  if (u.role !== 'developer' && u.role !== 'superadmin') throw fail_('İcazə yoxdur.', 'PERM');
  var sheets = [], cells = 0;
  ss_().getSheets().forEach(function (sh) {
    var r = sh.getMaxRows(), c = sh.getMaxColumns();
    cells += r * c;
    sheets.push({ name: sh.getName(), rows: Math.max(0, sh.getLastRow() - 1), maxRows: r, cols: c, cells: r * c });
  });
  sheets.sort(function (a, b) { return b.cells - a.cells; });
  var day = Date.now() - 864e5;
  var errs = rawRows_('Errors');
  var b = settingGet_('backup') || {};
  return { health: {
    ver: APP_VERSION, triggers: triggersStatus_(), sheets: sheets, cells: cells, limit: CELL_LIMIT,
    errors: { total: errs.length, day: errs.filter(function (x) { return stampMs_(x.lastAt) > day; }).reduce(function (s, x) { return s + (num_(x.count) || 1); }, 0) },
    backup: { last: b.last || '', url: b.url || '' }, shares: shareTotals_(), now: now_()
  } };
}
function devSessions_(u, req) {
  devOnly_(u);
  var now = Date.now();
  var uMap = {}, sMap = {};
  rawRows_('Users').forEach(function (x) { uMap[x.id] = x; });
  rawRows_('Students').forEach(function (x) { sMap[x.id] = x; });
  var list = rawRows_('Sessions').filter(function (x) { return Number(x.expiresAt) >= now; }).map(function (x) {
    var p = x.kind === 's' ? sMap[x.userId] : uMap[x.userId];
    return { id: String(x.token).slice(0, 16), name: p ? p.name : '(silinmiş)', kind: x.kind === 's' ? 's' : 'u',
      role: x.kind === 's' ? 'student' : (p ? p.role : ''), created: Number(x.createdAt) || 0, last: Number(x.lastAt) || 0, exp: Number(x.expiresAt) || 0 };
  }).sort(function (a, b) { return b.last - a.last; });
  return { sessions: list, stats: sessStats_() };
}
function devKillSession_(u, req) {
  devOnly_(u);
  var id = String(req.id || '');
  var rows = rawRows_('Sessions').filter(function (x) { return req.expired ? Number(x.expiresAt) < Date.now() : (id.length >= 8 && String(x.token).indexOf(id) === 0); });
  if (!rows.length) throw fail_('Sessiya tapılmadı.');
  var cache = CacheService.getScriptCache();
  rows.forEach(function (x) { cache.put('k_' + x.token, '1', SESSION_SECONDS); });
  removeRows_('Sessions', rows.map(function (x) { return x._row; }));
  log_(u, 'dev', req.expired ? 'Köhnə sessiyaları sildi' : 'Sessiyanı bağladı', rows.length + ' sessiya');
  return devSessions_(u, req);
}

function absStreaks_(lessons, courses, sMap, onlyTeacher) {
  var act = {};
  courses.forEach(function (c) {
    if (onlyTeacher && c.teacherId !== onlyTeacher) return;
    idList_(c.studentIds).forEach(function (id) { if (sMap[id] && isActiveSt_(sMap[id])) act[c.id + '|' + id] = c; });
  });
  var per = {};
  lessons.forEach(function (l) {
    var k = l.courseId + '|' + l.studentId;
    if (act[k]) (per[k] = per[k] || []).push(l);
  });
  var out = [];
  Object.keys(per).forEach(function (k) {
    var list = per[k].sort(function (a, b) { return a.date !== b.date ? (a.date < b.date ? 1 : -1) : (a.markedAt < b.markedAt ? 1 : -1); });
    var n = 0;
    for (var i = 0; i < list.length && list[i].status === ABSENT; i++) n++;
    if (n >= ABS_ALERT) out.push({ c: act[k], sid: list[0].studentId, n: n, last: list[0].date });
  });
  return out;
}
function absAlerts_(u, P, courses, lessons, sMap, uMap) {
  var all = u.role === 'superadmin' || P.indexOf('courses.view') !== -1;
  return absStreaks_(lessons, courses, sMap, all ? null : u.id).map(function (x) {
    var t = uMap[x.c.teacherId];
    return { studentId: x.sid, name: sMap[x.sid].name, courseId: x.c.id, course: courseLabelFrom_(x.c, sMap), teacherId: x.c.teacherId, teacher: t ? t.name : '', n: x.n, last: x.last };
  }).sort(function (a, b) { return (b.n - a.n) || (a.last < b.last ? 1 : -1); });
}
function absNotify_(u, c, entries) {
  var absent = entries.filter(function (e) { return e.status === ABSENT; }).map(function (e) { return e.studentId; });
  if (!absent.length) return;
  delete _raw.Lessons;
  var sMap = {}; rows_('Students').forEach(function (s) { sMap[s.id] = s; });
  var mine = {}; absent.forEach(function (id) { mine[id] = true; });
  var hits = absStreaks_(rows_('Lessons').filter(function (l) { return l.courseId === c.id && mine[l.studentId]; }), [c], sMap, null)
    .filter(function (x) { return x.n === ABS_ALERT; });
  if (!hits.length) return;
  var to = [c.teacherId];
  rows_('Users').forEach(function (x) { if (x.role === 'superadmin') to.push(x.id); });
  to = to.filter(function (id) { return id !== u.id; });
  hits.forEach(function (x) {
    notify_(to, 'absence', sMap[x.sid].name + ' «' + courseLabel_(c) + '» məşğələsində ardıcıl ' + ABS_ALERT + ' dərsə gəlməyib.', 'student', x.sid);
  });
}

function growPick_(comp, mk) {
  var prev = monthShift_(mk, -1), best = null;
  Object.keys(comp.live).forEach(function (sid) {
    if (isTrue_(comp.live[sid].noRank)) return;
    var o = comp.st[sid];
    if (!o || !qualifies_(o, mk) || !qualifies_(o, prev)) return;
    var a = monthScore_(o, prev), b = monthScore_(o, mk), d = b - a;
    if (d < GAME.growMin) return;
    if (!best || d > best.d || (d === best.d && b > best.b)) best = { sid: sid, d: d, a: a, b: b, name: comp.live[sid].name };
  });
  return best;
}

function canSeeStudent_(u, sid) {
  if (u.role === 'superadmin' || can_(u, 'students.view')) return true;
  return rows_('Courses').some(function (c) { return c.teacherId === u.id && idList_(c.studentIds).indexOf(sid) !== -1; }) ||
    rows_('Lessons').some(function (l) { return l.studentId === sid && l.markedBy === u.id; });
}
function reportData_(s, mk, forStudent) {
  var uMap = {}; rawRows_('Users').forEach(function (x) { uMap[x.id] = x; });
  var sMap = {}; rawRows_('Students').forEach(function (x) { sMap[x.id] = x; });
  var cMap = {}; rawRows_('Courses').forEach(function (c) { cMap[c.id] = c; });
  var mine = rows_('Lessons').filter(function (l) { return l.studentId === s.id; });
  var months = {};
  mine.forEach(function (l) { months[l.date.slice(0, 7)] = true; });
  months[monthOf_(0)] = true;
  var list = Object.keys(months).sort().reverse();
  if (!mk || !/^\d{4}-\d{2}$/.test(mk)) mk = list[0];
  var ls = mine.filter(function (l) { return l.date.slice(0, 7) === mk; }).sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); });
  var per = {};
  ls.forEach(function (l) {
    var c = cMap[l.courseId];
    var g = per[l.courseId] || (per[l.courseId] = {
      title: c ? studentCourseTitle_(c, uMap) : '(silinmiş məşğələ)',
      type: c ? c.type : '', teacher: c && uMap[c.teacherId] ? uMap[c.teacherId].name : '', subject: c && uMap[c.teacherId] ? uMap[c.teacherId].subject || '' : '',
      held: 0, absent: 0, lessons: [] });
    if (l.status === HELD) g.held++; else g.absent++;
    g.lessons.push({ date: l.date, status: l.status, topic: l.topic || '', reason: l.reason || '' });
  });
  var held = ls.filter(function (l) { return l.status === HELD; }).length;
  var ex = examsOfStudent_(s.id, uMap).list.filter(function (a) { return String(a.finishedAt || '').slice(0, 7) === mk; }).map(function (a) {
    return { title: a.title, score: a.score, max: a.maxPoints, pct: a.pct, status: a.status, pass: a.pass, at: a.finishedAt };
  });
  var game = null;
  var cfg = gameCfg_();
  if (cfg.on) {
    var comp = gameCompute_(), o = comp.st[s.id] || gameBlank_(s.id);
    var place = 0;
    rawRows_('Ratings').forEach(function (r) { if (r.kind === 'ind' && r.refId === s.id && r.month === mk) place = num_(r.place); });
    if (mk === monthOf_(0) && !isTrue_(s.noRank)) rankList_(comp, mk).forEach(function (x, i) { if (x.sid === s.id) place = i + 1; });
    var grow = rawRows_('Ratings').some(function (r) { return r.kind === 'grow' && r.refId === s.id && r.month === mk; });
    var bd = badgeRows_().filter(function (b) { return b.studentId === s.id && b.state !== 'revoked' && (b.month === mk || (!b.month && String(b.earnedAt).slice(0, 7) === mk)); })
      .map(function (b) { var d = BADGE_MAP[b.badge]; return d ? { id: d.id, name: d.name, tier: d.tier, rarity: RARITY[d.tier] } : null; }).filter(Boolean);
    var bonus = rows_('Bonuses').filter(function (b) { return b.studentId === s.id && String(b.createdAt).slice(0, 7) === mk; })
      .map(function (b) { return { reason: b.reason || '', by: uMap[b.givenBy] ? uMap[b.givenBy].name : '' }; });
    var lv = levelOf_(o.total);
    game = { points: o.months[mk] || 0, score: monthScore_(o, mk), prevScore: monthScore_(o, monthShift_(mk, -1)), total: o.total, level: lv.name,
      lvl: { i: lv.i, name: lv.name, min: lv.min, next: lv.next, nextMin: lv.nextMin }, place: place, live: mk === monthOf_(0),
      grow: grow, badges: bd, bonuses: bonus };
  }
  var pmk = monthShift_(mk, -1), pls = mine.filter(function (l) { return l.date.slice(0, 7) === pmk; });
  var pheld = pls.filter(function (l) { return l.status === HELD; }).length;
  var main = rows_('Users').filter(function (x) { return x.role === 'superadmin'; })[0];
  return { student: { name: s.name, parentName: forStudent ? '' : s.parentName || '' }, month: mk, label: fmtMonthAz_(mk), months: list,
    courses: Object.keys(per).map(function (k) { return per[k]; }), held: held, absent: ls.length - held, rate: ls.length ? Math.round(held / ls.length * 100) : null,
    exams: ex, game: game, made: now_(), school: SCHOOL_NAME,
    prev: { label: fmtMonthAz_(pmk), held: pheld, absent: pls.length - pheld, rate: pls.length ? Math.round(pheld / pls.length * 100) : null },
    signer: main ? main.name : MAIN_ADMIN.name,
    comments: rawRows_('Comments').filter(function (c) { return c.studentId === s.id && c.month === mk && String(c.text || '').trim(); })
      .map(function (c) { return { teacherId: c.teacherId, teacher: uMap[c.teacherId] ? uMap[c.teacherId].name : '', text: String(c.text), at: c.at }; }),
    link: s.cardToken || '' };
}
function monthReport_(u, req) {
  var s = mustStudent_(req.studentId);
  if (!canSeeStudent_(u, s.id)) throw fail_('Bu tələbənin hesabatına baxmaq üçün icazəniz yoxdur.', 'PERM');
  if (!s.cardToken) { update_('Students', s, { cardToken: newToken_() }); }
  var r = reportData_(s, String(req.month || ''), false);
  r.canComment = !u._readOnly && u.role !== 'developer';
  r.myComment = ''; r.comments.forEach(function (c) { if (c.teacherId === u.id) r.myComment = c.text; });
  log_(u, 'view', 'Aylıq hesabat hazırladı', s.name + ' · ' + r.label);
  return { report: r };
}
function sReport_(st, req) {
  return { report: reportData_(st, String(req.month || ''), true) };
}
function certData_(u, req) {
  var s = mustStudent_(req.studentId);
  if (!canSeeStudent_(u, s.id)) throw fail_('İcazə yoxdur.', 'PERM');
  if (s.status !== 'grad') throw fail_('Sertifikat yalnız məzun tələbələr üçündür.');
  var uMap = {}; rawRows_('Users').forEach(function (x) { uMap[x.id] = x; });
  var cMap = {}; rawRows_('Courses').forEach(function (c) { cMap[c.id] = c; });
  var mine = rows_('Lessons').filter(function (l) { return l.studentId === s.id; });
  var subj = {}, months = {}, held = 0, first = '', absent = 0;
  mine.forEach(function (l) {
    if (l.status !== HELD) { absent++; return; }
    held++;
    months[l.date.slice(0, 7)] = true;
    if (!first || l.date < first) first = l.date;
    var c = cMap[l.courseId], t = c && uMap[c.teacherId];
    if (t && t.subject) subj[t.subject] = true;
  });
  var g = gameCfg_().on ? gameSummary_(s.id) : null;
  var main = rows_('Users').filter(function (x) { return x.role === 'superadmin'; })[0];
  var no = certNo_(s);
  log_(u, 'student', 'Məzun sertifikatı hazırladı', s.name + ' · №' + no);
  return { cert: { name: s.name, no: no, from: first || String(s.createdAt).slice(0, 10), to: String(s.statusAt || today_()).slice(0, 10),
    subjects: Object.keys(subj), lessons: held, absent: absent, rate: held + absent ? Math.round(held / (held + absent) * 100) : null, months: Object.keys(months).length, level: g ? g.level.name : '', badges: g ? g.badges.length : 0,
    signer: main ? main.name : MAIN_ADMIN.name, school: SCHOOL_NAME, note: s.statusNote || '' } };
}
function publicGame_(sid) {
  var g = gameSummary_(sid);
  if (!g) return null;
  return { total: g.total, monthScore: g.monthScore, level: { name: g.level.name, i: g.level.i, next: g.level.next, nextMin: g.level.nextMin, min: g.level.min, pts: g.level.pts },
    badges: g.badges.map(function (b) { return { id: b.id, name: b.name, desc: b.desc, tier: b.tier, rarity: b.rarity, count: b.count, cat: b.cat }; }), badgeTotal: g.badgeTotal };
}

function idsOf_(req, max) {
  var ids = (Array.isArray(req.ids) ? req.ids : []).map(String).filter(function (v, i, a) { return v && a.indexOf(v) === i; });
  if (!ids.length) throw fail_('Heç kim seçilməyib.');
  if (ids.length > (max || 500)) throw fail_('Bir dəfəyə ən çox ' + (max || 500) + ' nəfər seçmək olar.');
  return ids;
}
function bulkStudentStatus_(u, req) {
  need_(u, 'students.edit');
  var ids = idsOf_(req), done = 0, failed = [];
  ids.forEach(function (id) {
    var s = findStudent_(id);
    if (!s) { failed.push({ name: id, msg: 'Tələbə tapılmadı.' }); return; }
    try { setStudentStatus_(u, { id: id, status: req.status, note: req.note }); done++; }
    catch (e) { if (!e.userMsg || e.code === 'PERM') throw e; failed.push({ name: s.name, msg: e.message }); }
  });
  return { done: done, failed: failed };
}
function bulkBadge_(u, req) {
  needSuper_(u);
  var b = BADGE_MAP[String(req.badge || '')];
  if (!b) throw fail_('Nişan tapılmadı.');
  if (b.season) throw fail_('Bayram nişanları yalnız bayram günü avtomatik verilir.');
  reqStr_(req.note, 'Səbəb', 3, 160);
  var ids = idsOf_(req, 300), done = 0, failed = [];
  ids.forEach(function (id) {
    var s = findStudent_(id);
    if (!s) { failed.push({ name: id, msg: 'Tələbə tapılmadı.' }); return; }
    try { gameBadge_(u, { studentId: id, badge: b.id, note: req.note, op: 'add' }); done++; }
    catch (e) { if (!e.userMsg || e.code === 'PERM') throw e; failed.push({ name: s.name, msg: e.message }); }
  });
  return { done: done, failed: failed };
}
function bulkUserLogins_(u, req) {
  need_(u, 'teachers.passwords');
  if (u._readOnly) throw fail_('İcazə yoxdur.', 'PERM');
  var ids = idsOf_(req, 200);
  var list = ids.map(findUser_).filter(function (t) {
    if (!t || t.role === 'developer') return false;
    return t.role !== 'superadmin' || u.role === 'superadmin';
  }).map(function (t) {
    var pw = String(t.password || '');
    return { id: t.id, name: t.name, login: t.login, role: t.role, password: pw.indexOf('h1$') === 0 ? '' : pw };
  }).sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  log_(u, 'security', 'Müəllimlərin giriş məlumatlarını kopyaladı', list.map(function (x) { return x.name; }).join(', '));
  return { list: list };
}

function teacherStats_(u, req) {
  if (u.role !== 'superadmin' && !can_(u, 'teachers.view')) throw fail_('İcazə yoxdur.', 'PERM');
  var lessons = rows_('Lessons');
  var months = {};
  lessons.forEach(function (l) { months[l.date.slice(0, 7)] = true; });
  months[monthOf_(0)] = true;
  var list = Object.keys(months).sort().reverse();
  var mk = /^\d{4}-\d{2}$/.test(String(req.month || '')) ? String(req.month) : list[0];
  var courses = rows_('Courses'), sMap = {};
  rows_('Students').forEach(function (s) { sMap[s.id] = s; });
  var T = {};
  var get = function (id) {
    return T[id] || (T[id] = { id: id, lessons: 0, onTime: 0, late: 0, delaySum: 0, maxDelay: 0, byOthers: 0, absent: 0, entries: 0, courses: 0, students: {}, bonuses: 0, last: '' });
  };
  rows_('Users').forEach(function (x) { if (x.role === 'teacher') get(x.id); });
  courses.forEach(function (c) {
    var t = get(c.teacherId);
    t.courses++;
    idList_(c.studentIds).forEach(function (id) { if (sMap[id] && isActiveSt_(sMap[id])) t.students[id] = true; });
  });
  var cMap = {}; rawRows_('Courses').forEach(function (c) { cMap[c.id] = c; });
  var seen = {};
  lessons.forEach(function (l) {
    if (l.date.slice(0, 7) !== mk) return;
    var c = cMap[l.courseId], owner = c ? c.teacherId : l.markedBy;
    var t = get(owner);
    t.entries++;
    if (l.status === ABSENT) t.absent++;
    var key = l.lessonId || (l.courseId + l.date);
    if (seen[key]) return;
    seen[key] = true;
    var m = get(l.markedBy);
    if (l.markedBy !== owner) t.byOthers++;
    m.lessons++;
    var d = Math.round((stampMs_(String(l.markedAt).slice(0, 10) + ' 00:00:00') - stampMs_(l.date + ' 00:00:00')) / 864e5);
    if (d <= 0) m.onTime++;
    else { m.late++; m.delaySum += d; if (d > m.maxDelay) m.maxDelay = d; }
    if (String(l.markedAt) > m.last) m.last = String(l.markedAt);
  });
  rows_('Bonuses').forEach(function (b) { if (String(b.createdAt).slice(0, 7) === mk && T[b.givenBy]) T[b.givenBy].bonuses++; });
  var uMap = {}; rawRows_('Users').forEach(function (x) { uMap[x.id] = x; });
  var out = Object.keys(T).map(function (id) {
    var t = T[id], x = uMap[id];
    if (!x || x.role === 'developer' || x.deletedAt) return null;
    if (x.role !== 'teacher' && !t.lessons && !t.courses) return null;
    return { id: id, name: x.name, role: x.role, subject: x.subject || '', lessons: t.lessons, onTime: t.onTime, late: t.late,
      pct: t.lessons ? Math.round(t.onTime / t.lessons * 100) : null, avgDelay: t.late ? Math.round(t.delaySum / t.late * 10) / 10 : 0, maxDelay: t.maxDelay,
      byOthers: t.byOthers, courses: t.courses, students: Object.keys(t.students).length, bonuses: t.bonuses, last: t.last,
      absRate: t.entries ? Math.round(t.absent / t.entries * 100) : null };
  }).filter(Boolean).sort(function (a, b) { return (b.lessons - a.lessons) || a.name.localeCompare(b.name, 'az'); });
  return { stats: { month: mk, label: fmtMonthAz_(mk), months: list, teachers: out } };
}

function shareStat_(field) {
  var day = today_();
  var row = rawRows_('Shares').filter(function (x) { return x.day === day; })[0];
  if (row) { var o = {}; o[field] = String(num_(row[field]) + 1); setCells_('Shares', row._row, o); }
  else { var n = { day: day, shares: '0', opens: '0', clicks: '0' }; n[field] = '1'; insertMany_('Shares', [n]); }
}
function shareTotals_() {
  var cut = monthShift_(monthOf_(0), -1) + '-' + today_().slice(8, 10);
  var t = { shares: 0, opens: 0, clicks: 0, m30: { shares: 0, opens: 0, clicks: 0 } };
  rawRows_('Shares').forEach(function (x) {
    ['shares', 'opens', 'clicks'].forEach(function (k) { t[k] += num_(x[k]); if (x.day >= cut) t.m30[k] += num_(x[k]); });
  });
  return t;
}
function sShare_(st, req) {
  if (!siteCfg_().share) throw fail_('Nailiyyət paylaşımı hazırda söndürülüb.');
  var kind = req.kind === 'level' ? 'level' : 'badge', id = String(req.id || '');
  var g = gameSummary_(st.id);
  if (!g) throw fail_('Nailiyyətlər sistemi hazırda bağlıdır.');
  if (kind === 'badge' && !g.badges.some(function (b) { return b.id === id; })) throw fail_('Bu nişan sizdə yoxdur.');
  if (kind === 'level' && Number(id) > g.level.i) throw fail_('Bu səviyyəyə hələ çatmamısınız.');
  var tok = st.shareToken;
  if (!tok) { tok = Utilities.getUuid().replace(/-/g, '').slice(0, 14); update_('Students', st, { shareToken: tok }); }
  shareStat_('shares');
  return { token: tok, focus: (kind === 'level' ? 'lv-' : 'b-') + id };
}
function shareFind_(t) {
  t = String(t || '');
  if (!/^[0-9a-f]{14}$/.test(t)) return null;
  return rows_('Students').filter(function (x) { return x.shareToken === t; })[0] || null;
}
function shareView_(req) {
  var s = shareFind_(req.t);
  if (!s) throw fail_('Link yanlışdır və ya artıq aktiv deyil.', 'NOTFOUND');
  var g = siteCfg_().share ? gameSummary_(s.id) : null;
  if (!g) throw fail_('Bu səhifə hazırda əlçatan deyil.', 'NOTFOUND');
  var f = String(req.f || ''), focus = null;
  var m = /^(b|lv)-(.+)$/.exec(f);
  if (m && m[1] === 'b') {
    var b = g.badges.filter(function (x) { return x.id === m[2]; })[0];
    if (b) focus = { kind: 'badge', id: b.id, name: b.name, desc: b.desc, tier: b.tier, rarity: b.rarity, count: b.count };
  } else if (m && m[1] === 'lv') {
    var li = Number(m[2]);
    if (li >= 0 && li <= g.level.i) focus = { kind: 'level', i: li, name: LEVELS[li] ? LEVELS[li][1] : g.level.name };
  }
  var cache = CacheService.getScriptCache(), ck = 'sv_' + req.t + '_' + f;
  if (!cache.get(ck)) { cache.put(ck, '1', 1800); shareStat_('opens'); }
  return { share: {
    name: shortName_(s.name), first: String(s.name || '').trim().split(/\s+/)[0],
    focus: focus, level: { i: g.level.i, name: g.level.name },
    badges: g.badges.map(function (b) { return { id: b.id, name: b.name, desc: b.desc, tier: b.tier, rarity: b.rarity, count: b.count }; }),
    total: g.badgeTotal
  } };
}
function shareHit_(req) {
  if (!shareFind_(req.t)) return {};
  var cache = CacheService.getScriptCache(), ck = 'sc_' + req.t + '_' + String(req.ua || '').slice(0, 40);
  if (cache.get(ck)) return {};
  cache.put(ck, '1', 600);
  shareStat_('clicks');
  return {};
}

var SEASON_DEF = { mode: 'auto', from: '12-20', to: '01-10', greetTitle: 'Yeni iliniz mübarək!',
  greetText: 'Köhnə ili birlikdə uğurla başa vurduq. Yeni ildə sizə can sağlığı, yeni biliklər və uğurlar arzulayırıq. Yeni iliniz mübarək!',
  greetFrom: 'Hörmətlə, ' + OWNER_TITLE + ' və ' + SCHOOL_NAME + ' komandası', given: {} };
var NOVRUZ_DEF = { mode: 'auto', from: '02-20', to: '03-31', day: '03-20', greetTitle: 'Novruz bayramınız mübarək!',
  greetText: 'Bahar gəldi, təbiət oyandı, tonqallar alovlandı! Novruz bayramı münasibətilə sizi ürəkdən təbrik edirik. Qoy süfrəniz bərəkətli olsun, evinizi sevinc və sağlamlıq bürüsün, yeni bahar sizə yeni uğurlar, yeni biliklər və xoş günlər gətirsin. Bayramınız mübarək!',
  greetFrom: 'Hörmətlə, ' + OWNER_TITLE + ' və ' + SCHOOL_NAME + ' komandası', given: {} };
var CR_NAMES = ['Su', 'Od', 'Yel', 'Torpaq'];
var MD_RE = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
function siteCfg_() {
  var x = settingGet_('site') || {};
  var so = x.social || {};
  return { social: { whatsapp: str_(so.whatsapp, 200), instagram: str_(so.instagram, 200), tiktok: str_(so.tiktok, 200) }, share: x.share !== false };
}
function cfgOf_(name, def) {
  var x = settingGet_(name) || {}, o = {};
  Object.keys(def).forEach(function (k) { o[k] = x[k] === undefined || x[k] === null || x[k] === '' ? def[k] : x[k]; });
  if (['off', 'on', 'auto'].indexOf(o.mode) === -1) o.mode = 'auto';
  if (!o.given || typeof o.given !== 'object') o.given = {};
  if (!MD_RE.test(o.from)) o.from = def.from;
  if (!MD_RE.test(o.to)) o.to = def.to;
  return o;
}
function seasonCfg_() { return cfgOf_('season', SEASON_DEF); }
function novruzCfg_() { var c = cfgOf_('novruz', NOVRUZ_DEF); if (!MD_RE.test(c.day)) c.day = NOVRUZ_DEF.day; return c; }
function simOffset_() {
  if (!TEST_SITE) return 0;
  var x = settingGet_('sim');
  return x && x.off ? Number(x.off) || 0 : 0;
}
function nowMs_() { return Date.now() + simOffset_() * 1000; }
function seasonNow_() { return Utilities.formatDate(new Date(nowMs_()), TIMEZONE, 'yyyy-MM-dd HH:mm:ss'); }
function bakuMs_(t) {
  var p = String(t).split(/[- :T]/).map(Number);
  return Date.UTC(p[0], p[1] - 1, p[2], p[3] || 0, p[4] || 0, p[5] || 0) - 4 * 3600000;
}
function dayAdd_(d, n) { var p = String(d).slice(0, 10).split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)).toISOString().slice(0, 10); }
function seasonActive_(c, now) {
  if (c.mode === 'on') return true;
  if (c.mode === 'off') return false;
  var md = now.slice(5, 10);
  return c.from <= c.to ? (md >= c.from && md <= c.to) : (md >= c.from || md <= c.to);
}
function nyYear_(now) { var y = Number(now.slice(0, 4)); return Number(now.slice(5, 7)) >= 7 ? y + 1 : y; }
function nvYear_(now) { var y = Number(now.slice(0, 4)); return now.slice(5, 10) > '04-15' ? y + 1 : y; }
function crDays_(y, day) {
  var p = day.split('-').map(Number), d = new Date(Date.UTC(y, p[0] - 1, p[1]));
  do { d.setUTCDate(d.getUTCDate() - 1); } while (d.getUTCDay() !== 2);
  var out = [];
  for (var i = 0; i < 4; i++) { out.unshift(d.toISOString().slice(0, 10)); d.setUTCDate(d.getUTCDate() - 7); }
  return out;
}
function cdTarget_(c, now) {
  var k = ['ny', 'nv', 'x'].indexOf(c.kind) === -1 ? 'ny' : c.kind, at;
  if (k === 'ny') at = bakuMs_(nyYear_(now) + '-01-01 00:00:00');
  else if (k === 'nv') at = bakuMs_(nvYear_(now) + '-' + novruzCfg_().day + ' 00:00:00');
  else { if (!/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(String(c.at || ''))) return null; at = bakuMs_(c.at); }
  return { k: k, at: at, title: k === 'x' ? str_(c.title, 60) : k === 'ny' ? 'Yeni ilə' : 'Novruz bayramına',
    done: k === 'x' ? (str_(c.done, 80) || 'Vaxt çatdı!') : k === 'ny' ? 'Yeni iliniz mübarək!' : 'Novruz bayramınız mübarək!' };
}
function sitePub_() {
  var cache = CacheService.getScriptCache(), hit = cache.get('sitepub'), out;
  if (hit) out = parseJson_(hit, {});
  else {
    var c = seasonCfg_(), v = novruzCfg_(), sc = siteCfg_(), now = seasonNow_(), md = now.slice(5, 10), d = now.slice(0, 10);
    var ny = seasonActive_(c, now), nv = !ny && seasonActive_(v, now), vy = nvYear_(now), vday = vy + '-' + v.day;
    out = { k: ny ? 'ny' : nv ? 'nv' : '', ny: ny, y: nyYear_(now), vy: vy, social: sc.social, share: sc.share, test: TEST_SITE, sim: simOffset_() !== 0 };
    if (c.mode !== 'off' && md >= '01-01' && md <= '01-07') out.greet = { k: 'ny', y: Number(now.slice(0, 4)), title: c.greetTitle, text: c.greetText, from: c.greetFrom };
    if (v.mode !== 'off') {
      if (d >= vday && d <= dayAdd_(vday, 4)) out.greet = { k: 'nv', y: vy, title: v.greetTitle, text: v.greetText, from: v.greetFrom };
      var cds = crDays_(vy, v.day), ci = cds.indexOf(d);
      if (ci !== -1) out.cr = { i: ci, name: CR_NAMES[ci], y: vy };
      if (nv) out.crDays = cds;
    }
    var cdc = settingGet_('countdown');
    if (cdc && cdc.on) { var t = cdTarget_(cdc, now); if (t && nowMs_() < t.at + 86400000) out.cd = t; }
    cache.put('sitepub', JSON.stringify(out), 120);
  }
  out.now = nowMs_();
  return out;
}
function siteFlush_() { var c = CacheService.getScriptCache(); c.remove('sitepub'); }
function grantFlush_() {
  var y = Number(seasonNow_().slice(0, 4)), keys = [];
  [y - 1, y, y + 1, y + 2].forEach(function (k) { keys.push('nyg_' + k, 'nvg_' + k); });
  CacheService.getScriptCache().removeAll(keys);
}
function grantSeason_(name, cfg, key, badge, at, note, text) {
  var cache = CacheService.getScriptCache(), ck = badge + 'g_' + key;
  if (cache.get(ck)) return 0;
  if (cfg.mode === 'off' || cfg.given[key]) { cache.put(ck, '1', 21600); return 0; }
  return withLock_(function () {
    var c2 = name === 'season' ? seasonCfg_() : novruzCfg_();
    if (c2.given[key]) return 0;
    var have = {};
    badgeRows_().forEach(function (r) { if (r.badge === badge && r.state !== 'revoked' && String(r.earnedAt).slice(0, 4) === at.slice(0, 4)) have[r.studentId] = true; });
    var ids = rows_('Students').filter(function (x) { return isActiveSt_(x) && !isTrue_(x.isTest) && !have[x.id]; }).map(function (x) { return x.id; });
    if (ids.length) {
      insertMany_('Badges', ids.map(function (id) { return { id: newId_('B'), studentId: id, badge: badge, earnedAt: at, month: '', by: '', note: note, state: '' }; }));
      notify_(ids, 'badge', text, 'sBadges', '');
    }
    c2.given[key] = seasonNow_();
    settingSet_(name, c2);
    log_(null, 'game', note + ' nişanı verildi', ids.length + ' tələbə');
    delete _raw['#game']; delete _raw['#bshare'];
    cache.put(ck, '1', 21600);
    siteFlush_();
    return ids.length;
  });
}
function nyGrantMaybe_() {
  var now = seasonNow_(), md = now.slice(5, 16), d = now.slice(0, 10), n = 0;
  if (md >= '12-31 10:00' || (md.slice(0, 5) >= '01-01' && md.slice(0, 5) <= '01-10')) {
    var key = String(nyYear_(now));
    n += grantSeason_('season', seasonCfg_(), key, 'ny', (Number(key) - 1) + '-12-31 10:00:00', 'Yeni il ' + key, 'Yeni il hədiyyəsi: «Yeni il sehri» nişanı səni gözləyir!');
  }
  var v = novruzCfg_(), vy = nvYear_(now), vday = vy + '-' + v.day;
  if (now >= vday + ' 10:00:00' && d <= dayAdd_(vday, 10))
    n += grantSeason_('novruz', v, String(vy), 'nv', vday + ' 10:00:00', 'Novruz ' + vy, 'Novruz hədiyyəsi: «Novruz sevinci» nişanı səni gözləyir!');
  return n;
}
function crToday_(st) {
  var v = novruzCfg_();
  if (v.mode === 'off' || isTrue_(st.isTest)) return null;
  var now = seasonNow_(), d = now.slice(0, 10), vy = nvYear_(now), i = crDays_(vy, v.day).indexOf(d);
  return i === -1 ? null : { i: i, d: d, vy: vy, now: now };
}
function crVisitCore_(st, t) {
  t = t || crToday_(st);
  if (!t) return false;
  var cache = CacheService.getScriptCache(), ck = 'crv_' + st.id + '_' + t.d;
  if (cache.get(ck)) return false;
  var key = 'cr-' + t.vy, row = rawRows_('Visits').filter(function (x) { return x.studentId === st.id && x.key === key; })[0];
  var days = row ? String(row.days || '').split(',').filter(Boolean) : [];
  var added = days.indexOf(String(t.i)) === -1;
  if (added) days.push(String(t.i));
  if (row) setCells_('Visits', row._row, { days: days.join(','), updatedAt: t.now });
  else insertMany_('Visits', [{ studentId: st.id, key: key, days: String(t.i), updatedAt: t.now }]);
  delete _raw['Visits'];
  if (days.length >= 4 && !badgeRows_().some(function (r) { return r.studentId === st.id && r.badge === 'cr4' && r.state !== 'revoked' && String(r.earnedAt).slice(0, 4) === String(t.vy); })) {
    insertMany_('Badges', [{ id: newId_('B'), studentId: st.id, badge: 'cr4', earnedAt: t.now, month: '', by: '', note: 'Novruz ' + t.vy, state: '' }]);
    notify_([st.id], 'badge', 'Dörd çərşənbənin hamısında bizimlə oldun. «Dörd Çərşənbə» nişanı səninkidir.', 'sBadges', '');
    delete _raw['#game']; delete _raw['#bshare'];
  }
  cache.put(ck, '1', 21600);
  return added;
}
function crVisit_(st) {
  var t = crToday_(st);
  if (!t || CacheService.getScriptCache().get('crv_' + st.id + '_' + t.d)) return false;
  return withLock_(function () { return crVisitCore_(st, t); });
}
function crInfo_(sid) {
  var v = novruzCfg_();
  if (v.mode === 'off') return null;
  var vy = nvYear_(seasonNow_()), row = rawRows_('Visits').filter(function (x) { return x.studentId === sid && x.key === 'cr-' + vy; })[0];
  return { n: row ? String(row.days || '').split(',').filter(Boolean).length : 0, days: row ? String(row.days || '').split(',').filter(Boolean).map(Number) : [] };
}
function socVal_(k, v) {
  v = str_(v, 200);
  if (!v) return '';
  if (/^https?:\/\/[^\s<>"]+$/i.test(v)) return v;
  if (k === 'whatsapp') { var d = v.replace(/[\s()+-]/g, ''); if (/^\d{7,15}$/.test(d)) return d; }
  else { var h = v.replace(/^@/, ''); if (/^[\w.]{1,60}$/.test(h)) return h; }
  throw fail_('«' + ({ whatsapp: 'WhatsApp', instagram: 'Instagram', tiktok: 'TikTok' })[k] + '» sahəsi düzgün deyil. Link (https://...) ' + (k === 'whatsapp' ? 'və ya nömrə (994501234567)' : 'və ya istifadəçi adı') + ' yazın.');
}
function siteGet_(u) {
  needSuper_(u);
  var now = seasonNow_(), c = seasonCfg_(), v = novruzCfg_(), vy = nvYear_(now);
  var act = rows_('Students').filter(function (x) { return isActiveSt_(x) && !isTrue_(x.isTest); }).length;
  var view = function (x, key) { return { mode: x.mode, from: x.from, to: x.to, greetTitle: x.greetTitle, greetText: x.greetText, greetFrom: x.greetFrom, active: seasonActive_(x, now), given: x.given[key] || '' }; };
  var ny = view(c, String(nyYear_(now))); ny.year = nyYear_(now); ny.students = act;
  var nv = view(v, String(vy)); nv.year = vy; nv.day = v.day; nv.students = act; nv.crDays = crDays_(vy, v.day);
  var cd = settingGet_('countdown') || {};
  var sim = TEST_SITE && u.role === 'developer' ? { off: simOffset_(), now: now } : null;
  return { site: siteCfg_(), season: ny, novruz: nv, countdown: { on: !!cd.on, kind: cd.kind || 'ny', title: cd.title || '', done: cd.done || '', at: cd.at || '' }, sim: sim, shares: shareTotals_() };
}
function siteSave_(u, req) {
  needSuper_(u);
  var so = req.social || {};
  var x = { social: { whatsapp: socVal_('whatsapp', so.whatsapp), instagram: socVal_('instagram', so.instagram), tiktok: socVal_('tiktok', so.tiktok) }, share: req.share !== false };
  var old = siteCfg_();
  settingSet_('site', x);
  siteFlush_();
  var ch = [];
  ['whatsapp', 'instagram', 'tiktok'].forEach(function (k) { if (old.social[k] !== x.social[k]) ch.push(k + ': ' + (x.social[k] || '—')); });
  if (old.share !== x.share) ch.push('paylaşım ' + (x.share ? 'açıldı' : 'söndürüldü'));
  log_(u, 'settings', 'Sayt ayarlarını dəyişdi', ch.join(' · ') || 'dəyişiklik yoxdur');
  return { site: x };
}
function seasonSave_(u, req) {
  needSuper_(u);
  var nv = req.key === 'nv', name = nv ? 'novruz' : 'season', c = nv ? novruzCfg_() : seasonCfg_();
  var mode = String(req.mode || '');
  if (['off', 'on', 'auto'].indexOf(mode) === -1) throw fail_('Rejim düzgün deyil.');
  var from = String(req.from || c.from), to = String(req.to || c.to);
  if (!MD_RE.test(from) || !MD_RE.test(to)) throw fail_('Tarixləri düzgün seçin.');
  if (nv) { var day = String(req.day || c.day); if (!MD_RE.test(day)) throw fail_('Bayram gününü düzgün seçin.'); c.day = day; }
  c.mode = mode; c.from = from; c.to = to;
  c.greetTitle = reqStr_(req.greetTitle, 'Təbrikin başlığı', 3, 80);
  c.greetText = reqStr_(req.greetText, 'Təbrikin mətni', 20, 900);
  c.greetFrom = reqStr_(req.greetFrom, 'İmza', 3, 120);
  settingSet_(name, c);
  siteFlush_();
  log_(u, 'settings', nv ? 'Novruz rejimi' : 'Yeni il rejimi', ({ off: 'Söndürülüb', on: 'Yandırılıb', auto: 'Avtomatik' })[mode] + ' · ' + from + ' → ' + to);
  return { season: { mode: c.mode, from: c.from, to: c.to, active: seasonActive_(c, seasonNow_()) } };
}
function cdSave_(u, req) {
  needSuper_(u);
  var kind = ['ny', 'nv', 'x'].indexOf(req.kind) === -1 ? 'ny' : req.kind;
  var x = { on: req.on === true, kind: kind, title: '', done: '', at: '' };
  if (kind === 'x') {
    x.title = reqStr_(req.title, 'Başlıq', 2, 60);
    x.done = str_(req.done, 80);
    x.at = String(req.at || '').replace('T', ' ').slice(0, 16);
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(x.at)) throw fail_('Tarix və saatı düzgün seçin.');
  }
  settingSet_('countdown', x);
  siteFlush_();
  log_(u, 'settings', 'Geri sayım', (x.on ? 'Yandırıldı' : 'Söndürüldü') + ' · ' + ({ ny: 'Yeni il', nv: 'Novruz', x: x.title })[kind]);
  return { countdown: x };
}
function simSet_(u, req) {
  needDev_(u);
  if (!TEST_SITE) throw fail_('Sınaq tarixi yalnız test saytında işləyir.');
  var at = String(req.at || '').replace('T', ' ');
  var off = at ? Math.round((bakuMs_(at) - Date.now()) / 1000) : 0;
  if (at && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(at)) throw fail_('Tarix və saatı düzgün seçin.');
  settingSet_('sim', { off: off });
  siteFlush_(); grantFlush_();
  log_(u, 'settings', 'Sınaq tarixi', at || 'real vaxt');
  return { sim: { off: off, now: seasonNow_() } };
}
function simReset_(u) {
  needDev_(u);
  if (!TEST_SITE) throw fail_('Bu əməliyyat yalnız test saytında işləyir.');
  var nums = rawRows_('Badges').filter(function (r) { return r.badge === 'ny' || r.badge === 'nv' || r.badge === 'cr4'; }).map(function (r) { return r._row; });
  removeRows_('Badges', nums);
  removeRows_('Visits', rawRows_('Visits').map(function (r) { return r._row; }));
  ['season', 'novruz'].forEach(function (n) { var x = settingGet_(n); if (x) { x.given = {}; settingSet_(n, x); } });
  siteFlush_(); grantFlush_();
  log_(u, 'settings', 'Bayram nişanları sıfırlandı', nums.length + ' nişan');
  return { removed: nums.length };
}
function cardPeople_(u) {
  if (!boss_(u)) need_(u, 'cards.make');
  var mine = null;
  if (!boss_(u) && !can_(u, 'students.view')) {
    mine = {};
    rows_('Courses').forEach(function (c) { if (c.teacherId === u.id) idList_(c.studentIds).forEach(function (id) { mine[id] = true; }); });
  }
  var st = rows_('Students').filter(function (x) { return isActiveSt_(x) && (!mine || mine[x.id]); })
    .map(function (x) { return { id: x.id, name: x.name }; }).sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  var staff = rows_('Users').filter(function (x) { return x.role !== 'developer'; })
    .map(function (x) { return { id: x.id, name: x.name, role: x.role }; }).sort(function (a, b) { return a.name.localeCompare(b.name, 'az'); });
  var main = rows_('Users').filter(function (x) { return x.role === 'superadmin'; })[0];
  return { people: { students: st, staff: staff, signer: main ? main.name : MAIN_ADMIN.name, me: u.name } };
}

var BD_MAX = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function bdMd_(v) {
  var m = String(v || '').match(/^(\d{2})-(\d{2})$/);
  if (!m) return '';
  var mo = Number(m[1]), d = Number(m[2]);
  if (mo < 1 || mo > 12 || d < 1 || d > BD_MAX[mo - 1]) return '';
  return m[0];
}
function bdIsToday_(bd, now) {
  if (!bd) return false;
  now = now || seasonNow_();
  var y = Number(now.slice(0, 4)), md = now.slice(5, 10);
  if (bd === md) return true;
  var leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  return bd === '02-29' && !leap && md === '02-28';
}
function bdTodayIds_() {
  if (_raw['#bdt']) return _raw['#bdt'];
  var now = seasonNow_(), ids = [];
  rows_('Students').forEach(function (x) { if (isActiveSt_(x) && bdIsToday_(bdMd_(x.bday), now)) ids.push(x.id); });
  rows_('Users').forEach(function (x) { if (bdIsToday_(bdMd_(x.bday), now)) ids.push(x.id); });
  _raw['#bdt'] = ids;
  return ids;
}
function bdaySet_(sheet, who, req) {
  var md = bdMd_(String(req.md || ''));
  if (!md) throw fail_('Gün və ayı düzgün seçin.');
  var fresh = sheet === 'Users' ? findUser_(who.id) : findStudent_(who.id);
  if (!fresh) throw fail_('Profil tapılmadı.');
  if (bdMd_(fresh.bday)) throw fail_('Ad günü artıq qeyd olunub və dəyişdirilə bilməz.');
  setCells_(sheet, fresh._row, { bday: md, bdaySetAt: now_() });
  delete _raw[sheet]; delete _raw['#bdt'];
  log_(sheet === 'Users' ? who : null, 'settings', 'Ad günü qeyd edildi', (sheet === 'Users' ? '' : who.name + ' · ') + md);
  return { md: md };
}
function bdayList_(u, req) {
  if (!(u.role === 'superadmin' || u.role === 'developer')) throw fail_('Bu bölmə yalnız kurs rəhbərliyi üçündür.', 'PERM');
  var now = seasonNow_(), mo = String(req.month || now.slice(5, 7));
  if (!/^(0[1-9]|1[0-2])$/.test(mo)) mo = now.slice(5, 7);
  var courses = rows_('Courses').filter(function (c) { return !c.deletedAt && !c.closedAt; }), uMap = {};
  rows_('Users').forEach(function (x) { uMap[x.id] = x; });
  var out = [], setN = 0, total = 0;
  rows_('Students').forEach(function (x) {
    if (!isActiveSt_(x) || isTrue_(x.isTest)) return;
    total++;
    var b = bdMd_(x.bday); if (!b) return;
    setN++;
    if (b.slice(0, 2) !== mo) return;
    var cs = courses.filter(function (c) { return idList_(c.studentIds).indexOf(x.id) !== -1; });
    out.push({ id: x.id, kind: 's', name: x.name, md: b, today: bdIsToday_(b, now),
      courses: cs.map(function (c) { return studentCourseTitle_(c, uMap) + (uMap[c.teacherId] ? ' · ' + uMap[c.teacherId].name : ''); }) });
  });
  rows_('Users').forEach(function (x) {
    if (x.deletedAt || isTrue_(x.isTest) || x.role === 'developer') return;
    total++;
    var b = bdMd_(x.bday); if (!b) return;
    setN++;
    if (b.slice(0, 2) !== mo) return;
    out.push({ id: x.id, kind: 'u', name: x.name, md: b, today: bdIsToday_(b, now), role: x.role, subject: x.subject || '' });
  });
  out.sort(function (a, b) { return a.md < b.md ? -1 : a.md > b.md ? 1 : a.name.localeCompare(b.name); });
  return { month: mo, today: now.slice(0, 10), items: out, setCount: setN, total: total };
}
function bdGrantMaybe_() {
  var now = seasonNow_(), d = now.slice(0, 10), cache = CacheService.getScriptCache(), ck = 'bdg_' + d;
  if (cache.get(ck)) return 0;
  if (settingGet_('bdDay') === d) { cache.put(ck, '1', 21600); return 0; }
  return withLock_(function () {
    if (settingGet_('bdDay') === d) return 0;
    var y = d.slice(0, 4), have = {};
    badgeRows_().forEach(function (r) { if (r.badge === 'bd' && r.state !== 'revoked' && String(r.earnedAt).slice(0, 4) === y) have[r.studentId] = true; });
    var sts = rows_('Students').filter(function (x) { return isActiveSt_(x) && !isTrue_(x.isTest) && bdIsToday_(bdMd_(x.bday), now); });
    var give = sts.filter(function (x) { return !have[x.id] && x.bdaySetAt && dayAdd_(x.bdaySetAt, 30) <= d; });
    if (give.length) {
      insertMany_('Badges', give.map(function (x) { return { id: newId_('B'), studentId: x.id, badge: 'bd', earnedAt: d + ' 00:00:00', month: '', by: '', note: 'Ad günü ' + y, state: '' }; }));
      notify_(give.map(function (x) { return x.id; }), 'badge', 'Ad günün mübarək! «Ad günü» nişanı səni gözləyir!', 'sBadges', '');
      delete _raw['#game']; delete _raw['#bshare'];
    }
    var courses = rows_('Courses').filter(function (c) { return !c.deletedAt && !c.closedAt; });
    sts.forEach(function (x) {
      var tids = courses.filter(function (c) { return idList_(c.studentIds).indexOf(x.id) !== -1; }).map(function (c) { return c.teacherId; });
      if (tids.length) notify_(tids, 'bday', 'Bu gün tələbənizin ad günüdür: ' + x.name + '.', 'student', x.id);
    });
    settingSet_('bdDay', d);
    if (sts.length) log_(null, 'game', 'Ad günləri', sts.length + ' tələbə · ' + give.length + ' nişan');
    cache.put(ck, '1', 21600);
    return give.length;
  });
}

var AV_OPEN = ['s1', 's2', 's3', 's5', 'g1', 'g2', 'g4', 'g6', 'a1', 'a3'];
var AV_STAFF = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
var AV_FEST = { ny: ['y1', 'y2', 'y3', 'y5'], nv: ['n1', 'n2', 'n3', 'n6'] };
var AV_SECRET = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
function avOk_(code, list) {
  var m = /^([a-z]\d):([0-2])$/.exec(String(code || ''));
  return m && list.indexOf(m[1]) !== -1 ? m[1] + ':' + m[2] : '';
}
function avSeason_() {
  if (_raw['#avs'] !== undefined) return _raw['#avs'];
  var now = seasonNow_(), c = seasonCfg_(), v = novruzCfg_(), k = '';
  if (seasonActive_(c, now)) k = 'ny' + nyYear_(now);
  else if (seasonActive_(v, now)) k = 'nv' + nvYear_(now);
  _raw['#avs'] = k;
  return k;
}
function avStudentEff_(x, sk) {
  if (sk) {
    var f = String(x.avatarFest || ''), i = f.indexOf('|');
    if (i !== -1 && f.slice(0, i) === sk) { var fc = avOk_(f.slice(i + 1), AV_FEST[sk.slice(0, 2)]); if (fc) return fc; }
  }
  return avOk_(x.avatar, AV_OPEN.concat(AV_SECRET));
}
function avMap_() {
  if (_raw['#avm']) return _raw['#avm'];
  var sk = avSeason_(), out = {};
  rows_('Users').forEach(function (x) { var c = avOk_(x.avatar, AV_STAFF); if (c) out[x.id] = c; });
  rows_('Students').forEach(function (x) { var c = avStudentEff_(x, sk); if (c) out[x.id] = c; });
  _raw['#avm'] = out;
  return out;
}
function avTop_() {
  var cache = CacheService.getScriptCache(), mk = monthOf_(0), hit = cache.get('avtop');
  if (hit) { var h = parseJson_(hit, null); if (h && h.m === mk) return h.ids; }
  var ids = [];
  try { if (gameCfg_().on) ids = rankList_(gameCompute_(), mk).slice(0, 3).map(function (x) { return x.sid; }); } catch (e) { console.error(e); }
  cache.put('avtop', JSON.stringify({ m: mk, ids: ids }), 1200);
  return ids;
}
function avRules_() {
  return [
    { id: 'q1', name: 'Aslan kral', hint: '«Usta» səviyyəsinə çat' },
    { id: 'q2', name: 'Kosmonavt', hint: '«Bilici» səviyyəsinə çat' },
    { id: 'q3', name: 'Professor', hint: '«Tam bal» nişanını qazan' },
    { id: 'q4', name: 'Ulduz', hint: 'Aylıq reytinqdə ilk 3-lüyə düş' },
    { id: 'q5', name: 'Alov', hint: '«Tam ay» nişanını qazan' },
    { id: 'q6', name: 'Robot dahi', hint: '10 fərqli nişan topla' }
  ];
}
function avSecretOpen_(sid) {
  var earned = earnedOf_(sid), n = 0, lv = 0;
  Object.keys(earned).forEach(function (k) { n++; });
  try { if (gameCfg_().on) { var comp = gameCompute_(), o = comp.st[sid] || gameBlank_(sid); lv = levelOf_(o.total).i; } } catch (e) { console.error(e); }
  var open = [];
  if (lv >= 5) open.push('q1');
  if (lv >= 3) open.push('q2');
  if (earned.perfect) open.push('q3');
  if (earned.m1 || earned.m2 || earned.m3) open.push('q4');
  if (earned.fullm) open.push('q5');
  if (n >= 10) open.push('q6');
  return open;
}
function avMine_(st) {
  var sk = avSeason_(), f = String(st.avatarFest || ''), i = f.indexOf('|');
  return {
    avatar: avOk_(st.avatar, AV_OPEN.concat(AV_SECRET)),
    fest: sk && i !== -1 && f.slice(0, i) === sk ? avOk_(f.slice(i + 1), AV_FEST[sk.slice(0, 2)]) : '',
    season: sk ? sk.slice(0, 2) : '', sk: sk,
    open: avSecretOpen_(st.id),
    rules: avRules_()
  };
}
function avSet_(sheet, who, req) {
  var fresh = sheet === 'Users' ? findUser_(who.id) : findStudent_(who.id);
  if (!fresh) throw fail_('Profil tapılmadı.');
  var id = String(req.id || ''), c = Math.floor(Number(req.c) || 0);
  if (c < 0 || c > 2) c = 0;
  var code = id ? id + ':' + c : '', ch = {};
  if (sheet === 'Users') {
    if (code && !avOk_(code, AV_STAFF)) throw fail_('Bu avatar mövcud deyil.');
    ch.avatar = code;
  } else if (req.fest) {
    var sk = avSeason_();
    if (!sk) throw fail_('Bayram avatarları hazırda aktiv deyil.');
    if (code && !avOk_(code, AV_FEST[sk.slice(0, 2)])) throw fail_('Bu bayram avatarı mövcud deyil.');
    ch.avatarFest = code ? sk + '|' + code : '';
  } else {
    if (code && AV_OPEN.indexOf(id) === -1) {
      if (AV_SECRET.indexOf(id) === -1) throw fail_('Bu avatar mövcud deyil.');
      if (avSecretOpen_(fresh.id).indexOf(id) === -1) throw fail_('Bu avatar hələ açılmayıb.');
    }
    ch.avatar = code;
    var sk2 = avSeason_();
    if (sk2 && String(fresh.avatarFest || '').indexOf(sk2 + '|') === 0) ch.avatarFest = '';
  }
  setCells_(sheet, fresh._row, ch);
  delete _raw[sheet]; delete _raw['#avm'];
  return { avatar: code };
}

var PROB_CATS = { bug: 'Xəta, nəsə işləmir', slow: 'Yavaş işləyir', look: 'Görünüş pozulub', idea: 'Təklif', other: 'Digər' };
function probReport_(kind, who, req) {
  var text = str_(req.text, 1500).trim();
  if (text.length < 5) throw fail_('Problemi bir az ətraflı yazın (ən azı 5 simvol).');
  var cat = PROB_CATS[req.cat] ? req.cat : 'other';
  var day = today_(), uid = String(who.id);
  var mine = rawRows_('Problems').filter(function (x) { return x.userId === uid && String(x.at).slice(0, 10) === day; });
  if (mine.length >= 10) throw fail_('Bu gün artıq çox müraciət göndərmisiniz. Sabah yenidən yazın.');
  var c = req.ctx && typeof req.ctx === 'object' ? req.ctx : {};
  var ctx = {};
  ['page', 'ver', 'ua', 'screen', 'theme', 'font', 'online', 'lastErr', 'standalone', 'lang'].forEach(function (k) { if (c[k] !== undefined && c[k] !== null) ctx[k] = String(c[k]).slice(0, 300); });
  var role = kind === 's' ? 'Tələbə' : (ROLE_LABELS[who.role] || who.role);
  insertMany_('Problems', [{ id: newId_('P'), at: now_(), kind: kind, userId: uid, name: who.name, role: role, cat: cat, text: text,
    page: str_(c.page, 120), ctx: JSON.stringify(ctx), status: 'new', doneAt: '' }]);
  var devs = rows_('Users').filter(function (x) { return x.role === 'developer'; }).map(function (x) { return x.id; });
  if (devs.length) notify_(devs, 'system', 'Yeni problem bildirişi: ' + who.name + ' (' + PROB_CATS[cat] + ')', 'dev', '');
  return { ok: true };
}
function devProblems_(u, req) {
  devOnly_(u);
  var rows = rawRows_('Problems');
  if (req.op === 'status' && req.id) {
    var r = rows.filter(function (x) { return x.id === String(req.id); })[0];
    if (!r) throw fail_('Müraciət tapılmadı.');
    var st = ['new', 'seen', 'done'].indexOf(req.status) !== -1 ? req.status : 'seen';
    setCells_('Problems', r._row, { status: st, doneAt: st === 'done' ? now_() : '' });
    delete _raw['Problems']; rows = rawRows_('Problems');
  } else if (req.op === 'clearDone') {
    var done = rows.filter(function (x) { return x.status === 'done'; });
    if (done.length) removeRows_('Problems', done.map(function (x) { return x._row; }));
    delete _raw['Problems']; rows = rawRows_('Problems');
  }
  return { list: rows.map(function (x) {
    return { id: x.id, at: x.at, kind: x.kind, userId: x.userId, name: x.name, role: x.role, cat: x.cat, catLabel: PROB_CATS[x.cat] || x.cat,
      text: x.text, page: x.page, ctx: parseJson_(x.ctx, {}), status: x.status || 'new', doneAt: x.doneAt };
  }).sort(function (a, b) { return a.at < b.at ? 1 : -1; }).slice(0, 300) };
}
function tourDone_(u) {
  var f = findUser_(u.id);
  if (f) { setCells_('Users', f._row, { tourAt: now_() }); delete _raw['Users']; }
  return { ok: true };
}

function certNo_(s) { return CERT_PREFIX + '-' + String(s.statusAt || now_()).slice(0, 4) + '-' + sha_(s.id).slice(0, 6).toUpperCase(); }
function certCheck_(req) {
  var no = String(req.no || '').trim().toUpperCase();
  if (!new RegExp('^' + CERT_PREFIX + '-\\d{4}-[0-9A-F]{6}$').test(no)) return { valid: false };
  var hit = rows_('Students').filter(function (s) { return s.status === 'grad' && certNo_(s) === no; })[0];
  if (!hit) return { valid: false };
  return { valid: true, no: no, name: hit.name, date: String(hit.statusAt || '').slice(0, 10), school: SCHOOL_NAME };
}
function reportComment_(u, req) {
  if (u._readOnly || u.role === 'developer') throw fail_('İcazə yoxdur.', 'PERM');
  var s = mustStudent_(req.studentId);
  if (!canSeeStudent_(u, s.id)) throw fail_('Bu tələbə üçün rəy yazmaq icazəniz yoxdur.', 'PERM');
  var mk = String(req.month || '');
  if (!/^\d{4}-\d{2}$/.test(mk)) throw fail_('Ay düzgün deyil.');
  var text = str_(req.text, 600).trim();
  var row = rawRows_('Comments').filter(function (c) { return c.studentId === s.id && c.month === mk && c.teacherId === u.id; })[0];
  if (row && !text) removeRows_('Comments', [row._row]);
  else if (row) setCells_('Comments', row._row, { text: text, at: now_() });
  else if (text) insertMany_('Comments', [{ id: newId_('M'), studentId: s.id, month: mk, teacherId: u.id, text: text, at: now_() }]);
  delete _raw['Comments'];
  log_(u, 'student', text ? 'Aylıq hesabata rəy yazdı' : 'Aylıq hesabatdan rəyi sildi', s.name + ' · ' + fmtMonthAz_(mk));
  return { ok: true };
}
