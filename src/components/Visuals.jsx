import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon, HeartIcon } from '@heroicons/react/24/outline';

const stats = [
  { 
    id: 1, 
    name: 'Total Subscribers', 
    stat: '71,897', 
    icon: HeartIcon, 
    change: '122', 
    changeType: 'increase',
    bgStyle: 'bg-gradient-to-r from-[#FF968F] to-[#E84141]',
    textColor: 'text-white' 
  },
  { 
    id: 2, 
    name: 'Avg. Open Rate', 
    stat: '58.16%', 
    icon: EnvelopeOpenIcon, 
    change: '5.4%', 
    changeType: 'increase',
    bgStyle: 'bg-white',
    textColor: 'text-gray-500'
  },
  { 
    id: 3, 
    name: 'Avg. Click Rate', 
    stat: '24.57%', 
    icon: CursorArrowRaysIcon, 
    change: '3.2%', 
    changeType: 'decrease',
    bgStyle: 'bg-white',
    textColor: 'text-gray-500'
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Visuals() {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900">Last 30 days</h3>
      
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-lg ${item.bgStyle} px-4 pt-5  shadow-sm sm:px-6 sm:pt-6`}
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon aria-hidden="true" className="size-6 text-white" />
              </div>
              <p className={`ml-16 truncate text-sm font-medium ${item.textColor}`}>{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className={`text-2xl font-semibold ${item.id === 1 ? 'text-white' : 'text-gray-900'}`}>
                {item.stat}
              </p>
              <p
                className={classNames(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold',
                )}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-500" />
                ) : (
                  <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-500" />
                )}
                
                <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                {item.change}
              </p>
             
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}