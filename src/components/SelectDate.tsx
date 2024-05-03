import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment-timezone";
import "../App.css";
// import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import { Spinner } from "./Spinner";

interface Props {
  serviceTimes: any;
  selectedDate: Moment | null;
  onChange: (date: Moment) => void;
}
const DATE_FORMAT = "YYYY-MM-DD";
export const SelectDate: React.FC<Props> = ({
  selectedDate,
  onChange,
  serviceTimes,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<Moment | null>(null);
  const [serviceDays, setServiceDays] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedMonth(null);
    setServiceDays(null);
    const startOf = serviceTimes.times?.[0].start;
    const getFirstDay = async () => {
      setSelectedMonth(moment(startOf).startOf("month"));
    };

    getFirstDay().catch((e) => {
      setError("");
    });
  }, []);

  moment.updateLocale("en", {
    week: { dow: 1, doy: 6 },
  });

  useEffect(() => {
    setServiceDays(null);
    if (!selectedMonth) {
      return;
    }
    const getTimeMatrix = async () => {
      /* might need service call filter by month start and month end if more events */
      const serviceDaysObj: any = {}; //{[]: {time: String, status: boolean}}
      serviceTimes.times?.map((time: any) => {
        const dayFormat = moment(time.start).format(DATE_FORMAT);
        const dayTime = moment(time.start).format("HH:mm");
        if (Object.keys(serviceDaysObj).includes(dayFormat)) {
          serviceDaysObj[dayFormat].push({
            time: dayTime,
            status: time.available,
          });
        } else {
          serviceDaysObj[dayFormat] = [
            {
              time: dayTime,
              status: time.available,
            },
          ];
        }
      });
      setServiceDays(serviceDaysObj);
    };

    getTimeMatrix().catch((e) => {
      setError("");
    });
  }, [selectedMonth]);

  const currentYearNo = parseInt(moment().format("Y"), 10);
  const currentMonth = moment().format("M");
  const currentMonthNo = parseInt(currentMonth, 10);

  const selectedMonthDays: number[] = selectedMonth
    ? [...Array(selectedMonth.daysInMonth()).keys()]
    : [];
  const selectedMonthNo = parseInt(selectedMonth?.format("M") || "0", 10);
  const selectedYearNo = parseInt(selectedMonth?.format("Y") || "0", 10);

  const selectedFutureYear = selectedYearNo - currentYearNo > 0;
  const selectedFutureMonth = currentMonthNo <= selectedMonthNo - 1;
  const leftArrow = selectedFutureMonth || selectedFutureYear;

  let emptyDays: number[] | null = selectedMonth && [...Array(selectedMonth.day()).keys(),];
  if (emptyDays && emptyDays.length === 0) {
    emptyDays = selectedMonthDays.filter((day) => day <= 6);
  }
  const lastRowCells =
    emptyDays && (emptyDays?.length + selectedMonthDays.length - 1) % 7;
  const emptyEndDays = selectedMonthDays.filter(
    (day) => lastRowCells && day < 7 - lastRowCells
  );
  // const lastEvent = state.events?.[state.events.length - 1]
  // const lastMonthNo = parseInt(
  //   moment(lastEvent?.start)
  //     .startOf('month')
  //     .format('M') || '0',
  //   10
  // )
  // const lastYearNo = parseInt(
  //   moment(lastEvent?.start)
  //     .startOf('month')
  //     .format('Y') || '0',
  //   10
  // )

  // const rightArrow = lastEvent && (selectedYearNo < lastYearNo || selectedMonthNo < lastMonthNo)

  return (
    <div className="calenderContainer">
      {error && <div>{error}</div>}
      {!(selectedMonth && serviceDays) && !error && (
        <Spinner message="Checking availability..." />
      )}
      {selectedMonth && serviceDays && !error && (
        <div className="tightContainer">
          <div className="calender">
            <div className="calenderMonthYear">
              {/* <div
                onClick={() => {
                  if (leftArrow) {
                    setSelectedMonth(selectedMonth.clone().add(-1, 'month'))
                  }
                }}
              >
                {leftArrow && <Icon icon={faChevronLeft} className={styles.icon} />}
              </div> */}
              <div className="headingContainer">
                <h4 className="heading">{selectedMonth.format("MMMM YYYY")}</h4>
              </div>
              {/* <div onClick={() => setSelectedMonth(selectedMonth.clone().add(1, 'month'))}>
                {rightArrow && <Icon icon={faChevronRight} className={styles.icon} />}
              </div> */}
            </div>
            {moment.weekdays(true).map((day) => (
              <div key={day} className="calenderCell calenderKey">
                {day.substring(0, 1)}
              </div>
            ))}
            {emptyDays?.map((_val: any, day: any) => {
              if (emptyDays && day === emptyDays.length - 1) {
                return null;
              }
              return <div key={day} className="calenderCell emptyCell" />;
            })}
            {selectedMonthDays.map((_val, index) => {
              const day = index + 1;
              const dayMatrix =
                serviceDays[
                  selectedMonth.clone().date(day).format(DATE_FORMAT)
                ];

              // const eventsDayArr = Object.keys(serviceDays)
              // const isEventWithinDate = eventsDayArr.includes(
              //   selectedMonth
              //     .clone()
              //     .date(day)
              //     .format(DATE_FORMAT)
              // )
              // const saleStatus = dayMatrix?.find((item: { saleStatus: string }) =>
              //   ['onSale', 'planned'].includes(item.saleStatus)
              // )
              // const limitedSpot = dayMatrix?.find((item: { availabilityIndicator: string }) =>
              //   ['green', 'yellow'].includes(item.availabilityIndicator)
              // )
              // const isaAvailabilityIndicatorExist = dayMatrix?.find(
              //   (item: { availabilityIndicator: string }) => item.availabilityIndicator
              // )
              const disabled = !dayMatrix || dayMatrix.length === 0;
              return (
                <React.Fragment key={day}>
                  <div
                    className={`calenderCell calenderDay 
                        ${
                          selectedMonth
                            .clone()
                            .date(day)
                            .isSame(selectedDate || "")
                            ? "calenderSelected"
                            : ""
                        } 
                          ${disabled ? "calenderDisabled" : ""}`}
                    // [styles.diagonalLine]: !saleStatus && isEventWithinDate
                    // })}
                    onClick={() =>
                      !disabled && onChange(selectedMonth.clone().date(day))
                    }
                  >
                    {/* {isaAvailabilityIndicatorExist && !limitedSpot && isEventWithinDate && saleStatus && (
                      <div className={styles.diamondGradient} />
                    )} */}
                    {day}
                  </div>
                </React.Fragment>
              );
            })}
            {emptyEndDays?.map((_val, day) => (
              <div key={day} className="calenderCell emptyCell" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
