import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";

const Contents = ({ countryParams, countryName }) => {
    const [confirmedData, setConfirmedData] = useState({});
    const [quarantinedData, setQuarantinedData] = useState({});
    const [comparedData, setComparedData] = useState({});
    const [confirmedRecoveryData, setConfirmedRecoveryData] = useState({});
    const [isData, SetIsData] = useState(true);

    useEffect(() => {
        setConfirmedData({});
        setQuarantinedData({});
        setComparedData({});
        setConfirmedRecoveryData({});

        const fetchEvents = async () => {
            const res = await axios.get(
                `https://api.covid19api.com/total/dayone/country/${countryParams}`
            );

            if (res.data.length === 0) {
                SetIsData(false);
                return;
            }
            makeData(res.data);
        };
        const makeData = (items) => {
            SetIsData(true);

            const arr = items.reduce((acc, cur) => {
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered = cur.Recovered;

                const findItem = acc.find(
                    (a) => a.year === year && a.month === month
                );

                if (!findItem) {
                    acc.push({
                        year,
                        month,
                        date,
                        confirmed,
                        active,
                        death,
                        recovered,
                    });
                }
                if (findItem && findItem.date < date) {
                    findItem.active = active;
                    findItem.death = death;
                    findItem.date = date;
                    findItem.year = year;
                    findItem.month = month;
                    findItem.recovered = recovered;
                    findItem.confirmed = confirmed;
                }

                return acc;
            }, []);

            const labels = arr.map((a) => `${a.month + 1}월`);

            setConfirmedData({
                labels,
                datasets: [
                    {
                        label: `${countryName} 누적 확진자`,
                        backgroundColor: "salmon",
                        fill: true,
                        data: arr.map((a) => a.confirmed),
                    },
                ],
            });

            setConfirmedRecoveryData({
                labels,
                datasets: [
                    {
                        label: "완치(월)",
                        borderColor: "#41E9F8",
                        data: arr.map((a) => a.recovered),
                    },
                    {
                        label: "확진(월)",
                        borderColor: "#A1FD6C",
                        data: arr.map((a) => a.confirmed),
                    },
                ],
            });

            setQuarantinedData({
                labels,
                datasets: [
                    {
                        label: "월별 격리자 현황",
                        borderColor: "green",
                        fill: false,
                        data: arr.map((a) => a.active),
                    },
                ],
            });

            const last = arr[arr.length - 1];
            const total = last.confirmed + last.recovered + last.death;
            const confirmedPer = Math.floor((last.confirmed / total) * 100);
            const recoveredPer = Math.floor((last.recovered / total) * 100);
            const deathPer = Math.ceil((last.death / total) * 100);
            setComparedData({
                labels: [
                    `확진자 ${confirmedPer}%`,
                    `격리해제 ${recoveredPer}%`,
                    `사망 ${deathPer}%`,
                ],
                datasets: [
                    {
                        label: "누적 확진, 해제, 사망 비율",
                        backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
                        borderColor: ["#ff3d67", "#059bff", "#ffc233"],
                        fill: false,
                        data: [last.confirmed, last.recovered, last.death],
                        hoverOffset: 8,
                    },
                ],
            });
        };

        fetchEvents();
    }, [countryName, countryParams]);

    return (
        <section>
            <h2>{countryName} 코로나 현황</h2>
            {isData ? (
                <div className="contents">
                    <div className="chart">
                        <Bar
                            height={150}
                            data={confirmedData}
                            options={{
                                // responsive: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "누적 확진자 추이",
                                        fontSize: 26,
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="chart">
                        <Line
                            data={quarantinedData}
                            options={{
                                // responsive: false,

                                plugins: {
                                    title: {
                                        display: true,
                                        text: "월별 격리자 현황",
                                        fontSize: 26,
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="chart">
                        <Line
                            data={confirmedRecoveryData}
                            options={{
                                // responsive: false,

                                plugins: {
                                    title: {
                                        display: true,
                                        text: "월별 확진환자 발생 및 완치 추세",
                                        fontSize: 26,
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="chart">
                        <Doughnut
                            style={{ margin: "0 auto" }}
                            height={450}
                            data={comparedData}
                            options={{
                                responsive: false,

                                plugins: {
                                    title: {
                                        display: true,
                                        text: `누적 확진, 해제, 사망 (${
                                            new Date().getMonth() + 1
                                        }월)`,
                                        fontSize: 26,
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <h2 style={{ textAlign: "center", height: "70vh" }}>
                        데이터가 없습니다.
                    </h2>
                </div>
            )}
        </section>
    );
};

export default Contents;
