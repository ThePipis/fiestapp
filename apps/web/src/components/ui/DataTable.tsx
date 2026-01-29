'use client';

import { ReactNode } from 'react';

interface DataTableProps {
  columns: {
    header: string;
    className?: string;
  }[];
  children: ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
}

export default function DataTable({ columns, children, isEmpty, emptyMessage }: DataTableProps) {
  return (
    <div className="bg-[#1E293B]/30 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/20 border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-white/5">
              {columns.map((col, i) => (
                <th key={i} className={`px-8 py-7 ${col.className}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-32 text-center text-slate-500 font-bold italic uppercase tracking-widest text-xs">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
