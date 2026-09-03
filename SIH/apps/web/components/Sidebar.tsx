'use client';

import { usePathname, useRouter } from 'next/navigation';

const navigation = [
  { name: 'Overview', icon: '▦', path: '/' },
  { name: 'Projects', icon: '◫', path: '/projects' },
  { name: 'Investigation', icon: '⌕', path: '/investigation' },
  { name: 'Analytics', icon: '◒', path: '/analytics' },
  { name: 'Reports', icon: '▤', path: '/reports' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0d141c]">
      {/* BRAND */}
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-400" />
          <div>
            <h1 className="text-lg font-semibold tracking-[0.2em] text-white">
              TRUSTUS
            </h1>
            <p className="mt-1 text-[9px] tracking-[0.18em] text-slate-500">
              MPLADS INTELLIGENCE
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-6">
        <p className="mb-3 px-3 text-[9px] font-semibold tracking-[0.2em] text-slate-600">
          COMMAND CENTRE
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path === '/investigation' && pathname?.startsWith('/investigation'));

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`flex w-full items-center gap-4 rounded-md px-3 py-3 text-left text-sm transition ${
                  isActive
                    ? 'border border-emerald-900/50 bg-emerald-950/30 text-emerald-400 font-medium'
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                }`}
              >
                <span className="w-5 text-center text-base">{item.icon}</span>
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* SYSTEM STATUS */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-md border border-slate-800 bg-[#101820] p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              SYSTEM OPERATIONAL
            </span>
          </div>
          <p className="mt-3 text-[9px] leading-4 text-slate-500">
            Anomaly analysis engine active
          </p>
        </div>

        <p className="mt-4 text-center text-[9px] tracking-widest text-slate-700">
          SIH26102
        </p>
      </div>
    </aside>
  );
}
