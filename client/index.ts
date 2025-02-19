
let q = {
  header: document.querySelector('header') as HTMLElement,
  bars: document.querySelector('header .bars') as HTMLElement,
  body: document.body,
  nav: document.querySelector('nav') as HTMLElement,
  main: document.querySelector('main') as HTMLElement,
  navLinks: document.querySelectorAll('nav a'),
  mainHeaders: document.querySelectorAll('main h1, main h2, main h3'),
  logo: document.querySelector('header .logo') as HTMLElement
}

//======================
// event funcs
//======================

function toggleNav() {
  if (q.body.classList.contains('content-grid')) {
    q.body.classList.add('nav-grid')
    q.body.classList.remove('content-grid')
    q.main.style.display = 'none'
    q.nav.style.display = 'flex'
    q.nav?.classList.toggle('fade-in')
    q.main?.classList.remove('fade-in')
    return
  }
  q.body.classList.remove('nav-grid')
  q.body.classList.add('content-grid')
  q.main.style.display = 'block'
  q.nav.style.display = ''
  q.nav?.classList.toggle('fade-in')
  q.main?.classList.add('fade-in')
}

//======================
// event register
//======================

q.bars?.addEventListener('click', () => {
  toggleNav()
})

for (let i = 0; i < q.navLinks.length; i++) {
  let link = q.navLinks[i]
  link.addEventListener('click', (e) => {
    if (window.innerWidth < 900) {
      toggleNav()
    }
  })
}

q.logo?.addEventListener('click', () => {
  q.main.scrollTo({ top: 0, behavior: 'smooth' });
});
