function LanguageInfo() {
  var n = navigator
  this.UALanguage = n.language
    ? n.language
    : n.browserLanguage
      ? n.browserLanguage
      : null
  this.userLanguage = n.userLanguage
    ? n.userLanguage
    : n.systemLanguage
      ? systemLanguage
      : null
}

function getCookie(lg) {
  var results = document.cookie.match('(^|;) ?' + lg + '=([^;]*)(;|$)')

  if (results) return unescape(results[2])
  else return null
}

var oLanguage = new LanguageInfo(),
  lg = getCookie('lg'),
  locat = window.location
console.log(locat)
if (!navigator.cookieEnabled || lg == 1) {
} else if (locat.href == 'http://localhost:3000/') {
  document.cookie = 'lg=1'
} else if (
  oLanguage.userLanguage == 'uk' ||
  oLanguage.userLanguage == 'uk-UA' ||
  oLanguage.UALanguage == 'uk' ||
  oLanguage.UALanguage == 'uk-UA'
) {
  document.cookie = 'lg=1'
  location.href = '/index.ua.html'
} else if (
  oLanguage.userLanguage == 'ru' ||
  oLanguage.userLanguage == 'ru-RU' ||
  oLanguage.UALanguage == 'ru' ||
  oLanguage.UALanguage == 'ru-RU'
) {
  document.cookie = 'lg=1'
  location.href = '/'
} else {
  document.cookie = 'lg=1'
  location.href = '/index.en.html'
}
