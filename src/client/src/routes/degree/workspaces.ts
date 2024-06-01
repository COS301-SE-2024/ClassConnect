import COS333Logo from '$lib/images/COS333_logo.png';
import COS314Logo from '$lib/images/COS314_logo.png';
import COS344Logo from '$lib/images/COS344_logo.png';
import COS332Logo from '$lib/images/COS332_logo.png';

//This file mock stores the mock data needed to display the workspaces on the home page.
//The information is stored as an array of  JSON objects
//Each workspace has a title, a description and an image.
export const workspaces = [
  {
    title: 'COS 333',
    description: 'Programming languages',
    image: COS333Logo,
  },
  {
    title: 'COS 314',
    description: 'Artificial Intelligence',
    image: COS314Logo,
  },
  {
    title: 'COS 344',
    description: 'Computer Graphics',
    image: COS344Logo,
  },
  {
    title: 'COS 332',
    description: 'Networking',
    image: COS332Logo,
  }
];