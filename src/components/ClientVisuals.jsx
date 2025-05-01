import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline'

const stats = [
  { id: 1, name: 'Total Subscribers', stat: '71,897', icon: UsersIcon, change: '122', changeType: 'increase',bgColor: 'bg-[linear-gradient(113deg,_#FF968F_16.01%,_#E84141_106.71%)]' },
  { id: 2, name: 'Avg. Open Rate', stat: '58.16%', icon: EnvelopeOpenIcon, change: '5.4%', changeType: 'increase',bgColor: 'bg-[linear-gradient(121deg,#7EEB7C_31.23%,#36C95F_108.38%)]' },
  { id: 3, name: 'Avg. Click Rate', stat: '24.57%', icon: CursorArrowRaysIcon, change: '3.2%', changeType: 'decrease', bgColor: 'bg-[linear-gradient(121deg,#92BDFF_31.23%,#369DC9_108.38%)]'},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ClientVisuals() {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900">Last 30 days</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className={`
              relative overflow-hidden rounded-[20px]
              ${item.bgColor}
              px-6 py-6 pr-16   /* add right padding for icon */
               sm:px-6  shadow-[0px_12px_23px_0px_rgba(62,73,84,0.04)]
            `}
          >
            <dt className="flex items-center justify-between">
              {/* Title */}
              <p className="truncate text-md font-medium text-white">
                {item.name}
              </p>

              {/* Icon on the right */}
              <div className="rounded-md bg-transparent p-3">
                <item.icon
                  aria-hidden="true"
                  className="h-8 w-8 text-white"
                />
              </div>
            </dt>

            <dd className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <p className="text-3xl font-semibold text-white">
                  {item.stat}
                </p>
                <p
                  className={classNames(
                    item.changeType === 'increase'
                      ? 'text-green-600'
                      : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <ArrowUpIcon
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 self-center text-green-500"
                    />
                  ) : (
                    <ArrowDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 self-center text-red-500"
                    />
                  )}
                  <span className="sr-only">
                    {item.changeType === 'increase'
                      ? 'Increased'
                      : 'Decreased'}{' '}
                    by
                  </span>
                  {item.change}
                </p>
              </div>

   
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
