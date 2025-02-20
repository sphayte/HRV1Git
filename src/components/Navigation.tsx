import ProfileMenu from './ProfileMenu'

export default function Navigation() {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Your other navigation items */}
          <div className="flex items-center">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
} 