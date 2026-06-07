import { NextRequest, NextResponse } from 'next/server';

// Função para decodificar JWT
function decodeJwt(token: string): { role?: string; [key: string]: any } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Rotas públicas (sem necessidade de autenticação)
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Se não tem token
  if (!token) {
    // Se tenta acessar rota protegida, redirecionar para login
    if (!isPublicRoute && !pathname.startsWith('/booking')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Se tem token, decodificar para obter role
  const decoded = decodeJwt(token);
  const role = decoded?.role;

  // Se é OWNER tentando acessar /staff
  if (role === 'OWNER' && pathname.startsWith('/staff')) {
    return NextResponse.redirect(new URL('/owner/dashboard', request.url));
  }

  // Se é STAFF tentando acessar /owner
  if (role === 'STAFF' && pathname.startsWith('/owner')) {
    return NextResponse.redirect(new URL('/staff/dashboard', request.url));
  }

  // Se está em /login ou /register com token válido, redirecionar para dashboard apropriado
  if (token && (pathname === '/login' || pathname === '/register')) {
    const redirectUrl =
      role === 'OWNER' ? '/owner/dashboard' : '/staff/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

// Configurar rotas que o middleware deve executar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
