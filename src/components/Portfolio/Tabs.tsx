// "use client";

// import React, { useMemo, useState } from "react";

// interface CardData {
//   id: number;
//   images: string[];
//   title: string;
//   subTitle: string;
//   description: string;
//   date: string;
//   TechStacks: string[];
// }

// type Props = {
//   data: CardData[];
//   onSelect?: (card: CardData) => void;
// };

// export default function PortfolioTabs({ data, onSelect }: Props) {
//   const [activeTab, setActiveTab] = useState("All");

//   // 🔥 Extract categories from subTitle
//   const categories = useMemo(() => {
//     const unique = Array.from(
//       new Set(
//         data.map((item) => {
//           if (item.subTitle.toLowerCase().includes("ai")) return "AI";
//           if (item.subTitle.toLowerCase().includes("ecom"))
//             return "Ecommerce";
//           if (item.subTitle.toLowerCase().includes("health"))
//             return "Healthcare";
//           if (item.subTitle.toLowerCase().includes("portfolio"))
//             return "Portfolio";
//           return "Other";
//         })
//       )
//     );

//     return ["All", ...unique];
//   }, [data]);

//   // 🔥 Filter logic
//   const filteredData = useMemo(() => {
//     if (activeTab === "All") return data;

//     return data.filter((item) => {
//       const sub = item.subTitle.toLowerCase();

//       if (activeTab === "AI") return sub.includes("ai");
//       if (activeTab === "Ecommerce") return sub.includes("ecom");
//       if (activeTab === "Healthcare") return sub.includes("health");
//       if (activeTab === "Portfolio") return sub.includes("portfolio");

//       return true;
//     });
//   }, [activeTab, data]);

//   return (
//     <div className="w-full">
//       {/* Tabs */}
//       <div className="mb-10 flex flex-wrap gap-3">
//         {categories.map((tab) => {
//           const active = activeTab === tab;

//           return (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`rounded-full px-5 py-2 text-sm font-medium transition
//                 ${
//                   active
//                     ? "bg-black text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//             >
//               {tab}
//             </button>
//           );
//         })}
//       </div>

//       {/* Cards */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredData.map((card) => (
//           <div
//             key={card.id}
//             onClick={() => onSelect?.(card)}
//             className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
//           >
//             <img
//               src={card.images[0]}
//               alt={card.title}
//               className="h-52 w-full object-cover"
//             />

//             <div className="p-5">
//               <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
//                 {card.subTitle}
//               </span>

//               <h3 className="mb-2 text-lg font-semibold">
//                 {card.title}
//               </h3>

//               <p className="text-sm text-gray-600 line-clamp-3">
//                 {card.description}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
