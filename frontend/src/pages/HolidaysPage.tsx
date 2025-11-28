import { useEffect, useState } from 'react';
import { useHolidayStore } from '@/stores/holidayStore';

export default function HolidaysPage() {
  const { holidays, isLoading, error, fetchHolidays } = useHolidayStore();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // 페이지 진입 시 국경일 목록 로드
  useEffect(() => {
    fetchHolidays(selectedYear);
  }, [selectedYear, fetchHolidays]);

  // 연도 변경 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
  };

  // 연도 옵션 생성 (이전 5년, 이후 5년)
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    return new Date().getFullYear() - 5 + i;
  });

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 바 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">국경일</h1>
        
        <div className="flex items-center space-x-4">
          <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
            연도:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
        </div>
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && holidays.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      ) : holidays.length === 0 ? (
        /* 국경일 없음 메시지 */
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedYear}년 국경일이 없습니다
            </h3>
            <p className="text-gray-500">
              선택한 연도에 등록된 국경일이 없습니다.
            </p>
          </div>
        </div>
      ) : (
        /* 국경일 목록 */
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {holidays.map((holiday) => (
              <li key={holiday.holidayId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {holiday.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      {holiday.isRecurring && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          매년 반복
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(holiday.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {holiday.description && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <p>{holiday.description}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}