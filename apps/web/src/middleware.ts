import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const adminPath = 'my-super-secret-path'

  // 1. Логика админки
  if (path.startsWith(`/${adminPath}`)) {
    const url = request.nextUrl.clone()
    url.pathname = path.replace(`/${adminPath}`, '/admin')
    if (!path.includes('/login')) {
      const authCookie = request.cookies.get('admin_auth')?.value
      if (authCookie !== 'admin123') {
        url.pathname = '/admin/login'
      }
    }
    return NextResponse.rewrite(url)
  }

  // 2. Логика определения языка
  // Если мы на корневой странице "/" (и это первый заход)
  if (path === '/') {
    const locale = request.headers.get('accept-language')?.split(',')[0].toLowerCase() || '';
    // Если браузер не русский (и не белорусский/украинский)
    if (!locale.startsWith('ru') && !locale.startsWith('be') && !locale.startsWith('uk')) {
      // Кидаем на английскую версию
      return NextResponse.redirect(new URL('/en', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
}
