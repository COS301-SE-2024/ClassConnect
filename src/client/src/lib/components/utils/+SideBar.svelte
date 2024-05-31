<script lang="ts">
  import Logo from '$lib/images/class-connect-logo.png'
  import Home from '$lib/images/homeIcon.svg'
  import BullHorn from '$lib/images/bullhorn.svg'
  import Clipboard from '$lib/images/clipboard.svg'
  import Landmark from '$lib/images/landmark.svg'
  import Lecturers from '$lib/images/lecturer.svg'
  import Student from '$lib/images/students.svg'
  import Settings from '$lib/images/gear.svg'
  import Users from '$lib/images/users.svg'

  const user = {
    name: 'Eugene',
    email: 'eugene.mpande@tuks.co.za',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  }

  const nav_links = [
    {
      icon: Home,
      name: 'Home',
      href: '/',
    },
    {
      icon: BullHorn,
      name: 'Announcements',
      href: '/announcements',
    },
    {
      icon: Clipboard,
      name: 'Activities',
      href: '/activities',
    },
    {
      icon: Landmark,
      name: 'Organisation',
      href: '/organisation',
    },
    {
      icon: Lecturers,
      name: 'Lecturers',
      href: '/lecturers',
    },
    {
      icon: Student,
      name: 'Students',
      href: '/students',
    },
    {
      icon: Users,
      name: 'Admins',
      href: '/admins',
    },
    {
      icon: Settings,
      name: 'Settings',
      href: '/settings',
    },
  ]
</script>

<aside class="flex flex-col w-64 h-screen px-4 py-1 overflow-y-auto bg-primary-100 border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
  <a href='/' class="mx-auto">
    <div class="flex items-center">
      <img class="w-auto h-20 mr-2" src={Logo} alt="Class Connect owl logo">
      <div class="roboto text-xl">
          Class Connect
      </div>
    </div>
  </a>

  <div class="flex flex-col items-center mt-2 -mx-2">
      <a href='/profile'>
        <img class="object-cover w-24 h-24 mx-2 rounded-full" src={user.avatar} alt="avatar">
      </a>
      <h4 class="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">{user.name}</h4>
      <p class="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{user.email}</p>
  </div>

  <div class="flex flex-col justify-between flex-1 mt-6">
      <nav>
          {#each nav_links as { icon, name, href }}
          <a class="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-primary-300 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href={href}>
              <img class="w-5 h-5" src={icon} alt={name} />
              <span class="mx-4 font-medium">{name}</span>
            </a>
          {/each}
      </nav>
  </div>
</aside>
