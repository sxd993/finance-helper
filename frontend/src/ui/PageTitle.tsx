export const PageTitle = ({ title, icon, isButton }: { title: string, icon: React.ReactNode, isButton: boolean }) => {
    return (
        <div className="flex flex-row items-center justify-between w-full max-w-md px-[5%]">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
            {icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          </div>
          {isButton &&
          <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors shadow-lg hover:shadow-xl">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
}
        </div>
    )
}