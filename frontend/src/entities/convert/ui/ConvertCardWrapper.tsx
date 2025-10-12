import React from 'react'

export const ConvertCardWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
    {children}
  </div>
)

