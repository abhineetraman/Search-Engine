import { useEffect, useMemo, useState } from "react";
import useDebounce from "./new_hook";
import { FaFilter } from 'react-icons/fa';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
//import Sidebar from "./sidebar";

function Sidebar({ toggleTable }) {

    const locationChange = () => {
        localStorage.clear();
        window.location.replace("/");
    }
  
    return (
        <div className="fixed top-0 left-0 bg-gray-800 text-white h-full w-64 p-4">
            <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
            <ul>
                <li className="mb-4">
                    <button onClick={toggleTable} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700">
                        Toggle Data
                    </button>
                </li>
                <li className="mb-4">
                <button onClick={locationChange} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700">
                        Logout
                </button>
                </li>
            </ul>
        </div>
    );
  }

function Home() {
    //dynamic typic
    const [data, setData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [searchData, setSearchData] = useState('')
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const debouncedSearchTerm = useDebounce(searchData, 500); // 500ms debounce time

    const getUniqueSectors = (data) => {
        const sectors = data.map(item => item.sector);
        return [...new Set(sectors)];
    };

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    
        const sortedData = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    
        setFilteredData(sortedData);
    };
    
    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    const getData = () => {
        fetch('http://localhost:5000/api/companydata', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then((response) => response.json())
        .then((json) =>  {
            console.log(json);
            setData(json);
            setFilteredData(json);
        });
    }

    const uniqueSectors = useMemo(() => getUniqueSectors(data), [data]);

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        let newFilteredData = data;

        if (debouncedSearchTerm) {
            newFilteredData = newFilteredData.filter((val) =>
                val.entity.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                val.sector.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                val.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                val.website.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                val.revenue.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                //val.id.toInteger().includes(debouncedSearchTerm.toInteger()) ||
                val.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }

        if (selectedSector) {
            newFilteredData = newFilteredData.filter(val => val.sector === selectedSector);
        }

        setFilteredData(newFilteredData);
    }, [debouncedSearchTerm, selectedSector, data]);

    const TableReact = () => {
        const [productList] = useState(filteredData);
        const [rowsLimit] = useState(10);
        const [rowsToShow, setRowsToShow] = useState(productList.slice(0, rowsLimit));
        const [customPagination, setCustomPagination] = useState([]);
        const [totalPage] = useState(Math.ceil(productList?.length / rowsLimit));
        const [currentPage, setCurrentPage] = useState(0);
      
        const nextPage = () => {
            const startIndex = rowsLimit * (currentPage + 1);
            const endIndex = startIndex + rowsLimit;
            const newArray = filteredData.slice(startIndex, endIndex);
            setRowsToShow(newArray);
            setCurrentPage(currentPage + 1);
        };
      
        const changePage = (value) => {
            const startIndex = value * rowsLimit;
            const endIndex = startIndex + rowsLimit;
            const newArray = filteredData.slice(startIndex, endIndex);
            setRowsToShow(newArray);
            setCurrentPage(value);
        };

        const previousPage = () => {
            const startIndex = (currentPage - 1) * rowsLimit;
            const endIndex = startIndex + rowsLimit;
            const newArray = filteredData.slice(startIndex, endIndex);
            setRowsToShow(newArray);
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                setCurrentPage(0);
            }
        };

        useMemo(() => {
            setCustomPagination(
                Array(Math.ceil(productList?.length / rowsLimit)).fill(null)
            );
        }, [productList?.length, rowsLimit]);

        return (
            <div className="min-h-screen h-full bg-white flex  items-center justify-center pt-10 pb-14">
              <div className="w-full max-w-4xl px-2">
                <div>
                  <h1 className="text-2xl font-medium">
                    <input className="p-2 mt-8 rounded-xl border border-[#000000]" onChange={(e) => setSearchData(e.target.value)} type="text" value={searchData} placeholder="Search" name="searchdata"></input>  
                  </h1>
                </div>
                <div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none mt-2">
                  <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
                    <thead className="rounded-lg text-base text-white font-semibold w-full">
                      <tr className="bg-[#222E3A]/[6%]">
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('id')}>
                            ID {getSortIcon('id')}
                        </th>
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('entity')}>
                            Entity {getSortIcon('entity')}
                        </th>
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('sector')}>
                            Sector {getSortIcon('sector')}
                            <div className="relative ml-2">
                                <FaFilter className="mr-2 inline-block" />
                                <select
                                    value={selectedSector}
                                    onChange={(e) => setSelectedSector(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                >
                                    <option value="">All Sectors</option>
                                    {uniqueSectors.map(sector => (
                                        <option key={sector} value={sector}>
                                            {sector}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </th>
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('email')}>
                            Email {getSortIcon('email')}
                        </th>
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('incorporation')}>
                            Incorporation {getSortIcon('incorporation')}
                        </th>
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('address')}>
                            Address {getSortIcon('address')}
                        </th>
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('website')}>
                            Website {getSortIcon('website')}
                        </th>
                        <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap" onClick={() => sortData('revenue')}>
                            Revenue {getSortIcon('revenue')}
                        </th>
                        <th className="flex items-center py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap gap-1" onClick={() => sortData('is_verified')}>
                          Verified {getSortIcon('is_verified')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowsToShow?.map((data, index) => (
                        <tr
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                          }`}
                          key={index}
                        >
                          <td
                            className={`py-2 px-3 font-normal text-base ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            } whitespace-nowrap`}
                          >
                            {data?.id}
                          </td>
                          <td
                            className={`py-2 px-3 font-normal text-base ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            } whitespace-nowrap`}
                          >
                            {data?.entity}
                          </td>
                          <td
                            className={`py-2 px-3 font-normal text-base ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            } whitespace-nowrap`}
                          >
                            {data?.sector}
                          </td>
                          <td
                            className={`py-2 px-3 text-base  font-normal ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            } whitespace-nowrap`}
                          >
                            {data?.email}
                          </td>
                          <td
                            className={`py-2 px-3 text-base  font-normal ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            } min-w-[250px]`}
                          >
                            {data?.incorporation}
                          </td>
                          <td
                            className={`py-2 px-3 text-base  font-normal ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            } min-w-[250px]`}
                          >
                            {data?.address}
                          </td>
                          <td
                            className={`py-2 px-3 text-base  font-normal ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            } min-w-[250px]`}
                          >
                            {data?.website}
                          </td>
                          <td
                            className={`py-5 px-4 text-base  font-normal ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            }`}
                          >
                            {data?.revenue}
                          </td>
                          <td
                            className={`py-5 px-4 text-base  font-normal ${
                              index === 0
                                ? "border-t-2 border-black"
                                : index === rowsToShow?.length
                                ? "border-y"
                                : "border-t"
                            }`}
                          >
                            {data?.is_verified}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-full  flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
                  <div className="text-lg">
                    Showing {currentPage === 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
                    {currentPage === totalPage - 1
                      ? productList?.length
                      : (currentPage + 1) * rowsLimit}{" "}
                    of {productList?.length} entries
                  </div>
                  <div className="flex">
                    <ul
                      className="flex justify-center items-center gap-x-[10px] z-30"
                      role="navigation"
                      aria-label="Pagination"
                    >
                      <li
                        className={` prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                          currentPage === 0
                            ? "bg-[#cccccc] pointer-events-none"
                            : " cursor-pointer"
                        }
          `}
                        onClick={previousPage}
                      >
                      </li>
                      {customPagination?.map((data, index) => (
                        <li
                          className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                            currentPage === index
                              ? "text-blue-600  border-sky-500"
                              : "border-[#E4E4EB] "
                          }`}
                          onClick={() => changePage(index)}
                          key={index}
                        >
                          {index + 1}
                        </li>
                      ))}
                      <li
                        className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                          currentPage === totalPage - 1
                            ? "bg-[#cccccc] pointer-events-none"
                            : " cursor-pointer"
                        }`}
                        onClick={nextPage}
                      >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        };

    return (
      <div>
        <h2 className="Heading h-[10vh] bg-gray-200 text-4xl font-bold text-gray-800">Company Data System</h2>

        <div className="Home flex">
            <Sidebar toggleTable={() => setShowTable(!showTable)}></Sidebar>
            <div className="flex-1 p-2">
                <div className="container ml-[10%]">
                    {showTable ? <TableReact /> : <div className="flex items-center justify-center h-screen"><h2 className="text-4xl font-bold text-center">Welcome to the Homepage</h2></div>}
                </div>
            </div>           
        </div>
      </div>
    );
  }
  
  export default Home;
  