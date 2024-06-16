/** @type {import('./$types').PageLoad} */

export function load() {
	return {
        announcements : [
            {
                date: '10 Oct',
                heading: 'Campus Safety Drill',
                announcement: 'A campus-wide safety drill will be conducted on October 15th at 10 AM. All students and staff are required to participate. Please review the safety procedures and follow instructions during the drill.',

            },
            {
                date: '12 Oct',
                heading: 'New Library Hours',
                announcement: 'Starting October 20th, the university library will have extended hours. It will now be open from 8 AM to 12 AM, Monday through Friday, and 9 AM to 10 PM on weekends.',
            },
            {
                date: '15 Oct',
                heading: 'Guest Lecture Series',
                announcement: 'We are excited to announce a new guest lecture series starting October 25th. Prominent speakers from various fields will be sharing their insights. All students and faculty are encouraged to attend.',
            }
        ]
	};
}