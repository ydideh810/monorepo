import { Computer } from "@bitcoin-computer/lib"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BsArrowUpRight } from "react-icons/bs"
import Loader from "./Loader"

export default function SmartContracts(props: { computer: Computer }) {
  const { computer } = props
  const contractsPerPage = 7

  const [isLoading, setIsLoading] = useState(false)
  const [pageNum, setPageNum] = useState(0)
  const [isNextAvailable, setIsNextAvailable] = useState(true)
  const [isPrevAvailable, setIsPrevAvailable] = useState(pageNum > 0)
  const [revs, setRevs] = useState<string[]>([])
  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true)
        const queryRevs = await computer.query({
          offset: contractsPerPage * pageNum,
          limit: contractsPerPage + 1,
        })

        if (queryRevs.length <= contractsPerPage) {
          setIsNextAvailable(false)
        } else {
          queryRevs.splice(-1)
          setIsNextAvailable(true)
        }
        setRevs(queryRevs)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }
    fetch()
  }, [computer, revs.length, pageNum])

  const handleNext = async () => {
    setIsPrevAvailable(true)
    setPageNum(pageNum + 1)
  }

  const handlePrev = async () => {
    setIsNextAvailable(true)
    if (pageNum - 1 === 0) {
      setIsPrevAvailable(false)
    }
    setPageNum(pageNum - 1)
  }
  return (
    <div className="relative overflow-x-auto sm:rounded-lg pt-4">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Smart Contract
            </th>
          </tr>
        </thead>
        <tbody>
          {revs.map((rev) => (
            <tr key={rev} className="bg-white border-b hover:bg-gray-50 ">
              <td className="px-6 py-4">
                <Link to={`/outputs/${rev}`} className="hover:text-bit-blue">
                  {rev}
                  <BsArrowUpRight className="inline text-l ml-1 hover:text-slate-500" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {revs.length > 0 && (
        <nav className="flex items-center justify-between p-4" aria-label="Table navigation">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                disabled={!isPrevAvailable}
                onClick={handlePrev}
                className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white disabled:bg-slate-100 border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
            <li>
              <button
                disabled={!isNextAvailable}
                onClick={handleNext}
                className="block px-3 py-2 leading-tight text-gray-500 bg-white disabled:bg-slate-100 border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      )}
      {isLoading && <Loader />}
    </div>
  )
}
