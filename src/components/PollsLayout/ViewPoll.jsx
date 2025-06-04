
import { useState, useEffect } from "react"
import { fetchSpecificPoll } from "../../utils/Poll"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function ViewPoll({ pollId, onBack }) {
  const eventId = localStorage.getItem("eventId")
  const [loading, setLoading] = useState(true)
  const [pollData, setPollData] = useState(null)
  const [error, setError] = useState(null)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  useEffect(() => {
    const loadPollData = async () => {
      try {
        setLoading(true)
        const data = await fetchSpecificPoll(eventId, pollId)
        setPollData(data)
      } catch (err) {
        console.error("Error loading poll data:", err)
        setError("Failed to load poll data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (pollId) {
      loadPollData()
    }
  }, [pollId, eventId])

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Polls
            </button>
          </div>
          <div className="bg-red-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!pollData) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Polls
            </button>
          </div>
          <p className="text-gray-500">No poll data available.</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const chartData = []
  const options = [pollData.Option1, pollData.Option2, pollData.Option3, pollData.Option4].filter(
    (option) => option && option.trim() !== "",
  )

  options.forEach((option, index) => {
    const optionIndex = index + 1
    const count = pollData.Results?.options[optionIndex]?.count || 0
    const percentage = pollData.Results?.options[optionIndex]?.percentage || 0

    if (option) {
      chartData.push({
        name: option,
        value: count,
        percentage: percentage,
      })
    }
  })

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Polls
          </button>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              pollData.Live === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {pollData.Live === 1 ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{pollData.Question}</h2>
          <p className="text-sm text-gray-500">Created on: {new Date(pollData.Created_AT).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Poll Options</h3>
            <ul className="space-y-3">
              {options.map((option, index) => {
                const optionIndex = index + 1
                const count = pollData.Results?.options[optionIndex]?.count || 0
                const percentage = pollData.Results?.options[optionIndex]?.percentage || 0

                return (
                  <li key={index} className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center mr-2">
                      <div
                        className="h-4 w-4 rounded-full mr-3 flex-shrink-0"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className="text-gray-700 truncate max-w-[180px] sm:max-w-xs">{option}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                      {count} votes ({percentage}%)
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Poll Statistics</h3>
              <p className="text-sm text-gray-700">
                Total Responses: <span className="font-medium">{pollData.Results?.total_responses || 0}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Results Visualization</h3>
            {chartData.length > 0 && pollData.Results?.total_responses > 0 ? (
              <div className="w-full h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="60%"
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${percentage}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} votes`, "Responses"]} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">No votes recorded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Responses</h3>
          <div className="overflow-x-auto -mx-4 sm:-mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Selected Option
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Response Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pollData.UserResponses.map((response, index) => {
                    const optionIndex = response.Selected_Option
                    const optionText =
                      optionIndex === 1
                        ? pollData.Option1
                        : optionIndex === 2
                          ? pollData.Option2
                          : optionIndex === 3
                            ? pollData.Option3
                            : optionIndex === 4
                              ? pollData.Option4
                              : "Unknown"

                    return (
                      <tr key={index}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {response.name || `User #${response.Registration_Number}`}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{optionText}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(response.Response_Time).toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
