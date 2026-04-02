/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  getFlashSales,
  buyFlashSale,
  type FlashSaleItem,
} from "./apis/flashsales";

const IphoneFlashSale = () => {
  const [flashSale, setFlashSale] = useState<FlashSaleItem | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [feching, setIsfeching] = useState(false);
  const [error, setError] = useState("");
  const [saleStatus, setSaleStatus] = useState<"COMING" | "ACTIVE" | "EXPIRED">(
    "COMING",
  );

  // Regex kiểm tra số điện thoại Việt Nam (10 số, đầu số hợp lệ)
  const validateVNPhone = (phone: string) => {
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return vnf_regex.test(phone);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!flashSale) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(flashSale.startDate).getTime();
      const end = new Date(flashSale.endDate).getTime();

      if (now < start) setSaleStatus("COMING");
      else if (now > end) setSaleStatus("EXPIRED");
      else setSaleStatus("ACTIVE");
    }, 1000);
    return () => clearInterval(timer);
  }, [flashSale]);

  const fetchData = async () => {
    try {
      const sales = await getFlashSales();
      console.log(sales);
      const iphoneSale = sales.find((item) => item.productId === 1);
      if (iphoneSale) setFlashSale(iphoneSale);
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();

    if (!validateVNPhone(cleanPhone)) {
      return alert(
        "Số điện thoại không hợp lệ (Phải có 10 số, đúng đầu số VN)",
      );
    }
    try {
      setIsfeching(true);
      const data = await buyFlashSale(cleanPhone, flashSale!.productId);
      setFlashSale((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          product: {
            ...prev.product,
            stock: data.stock,
          },
        };
      });
      alert("Đã gửi yêu cầu đặt hàng thành công!");
      setPhoneNumber("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Hệ thống bận, vui lòng thử lại!");
    } finally {
      setIsfeching(false);
    }
  };

  if (loading)
    return <div className="text-center py-20">Đang tải thông tin...</div>;

  if (!flashSale || saleStatus === "EXPIRED") {
    return (
      <div className="text-center py-20 font-bold text-gray-400 text-3xl italic">
        No product
      </div>
    );
  }

  const isInvalid = phoneNumber.length > 0 && !validateVNPhone(phoneNumber);

  return (
    <div className="max-w-md mx-auto my-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-gray-50 p-8 flex justify-center">
        <img
          src={flashSale.product.imageUrl}
          alt="iPhone 15"
          className="h-60 object-contain"
        />
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-black text-gray-900">
          {flashSale.product.name}
        </h2>

        <div className="flex items-baseline gap-3 my-4">
          <span className="text-3xl font-bold text-red-600">
            ${flashSale.product.price}
          </span>
          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">
            -{flashSale.discount}%
          </span>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold mb-1 uppercase text-gray-400">
            <span>Tình trạng kho</span>
            <span>{flashSale.product.stock} máy còn lại</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full">
            <div
              className="bg-orange-500 h-full rounded-full transition-all"
              style={{ width: `${(flashSale.product.stock / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        {saleStatus === "ACTIVE" ? (
          <form onSubmit={handleOrder} className="space-y-4">
            <div className="group">
              <input
                type="text"
                placeholder="Nhập số điện thoại (10 số)..."
                maxLength={20}
                className={`w-full p-4 bg-gray-50 border-2 rounded-xl outline-none transition-all ${
                  isInvalid
                    ? "border-red-400 focus:border-red-500"
                    : "border-transparent focus:border-blue-500"
                }`}
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
              />
              {isInvalid && (
                <p className="text-red-500 text-xs mt-1 italic">
                  SĐT không đúng định dạng VN
                </p>
              )}
            </div>

            {flashSale.product.stock > 0 ? (
              <button
                disabled={feching}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-lg"
              >
                {feching ? "PROCESSING..." : "ADD TO CART"}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-white font-bold py-4 rounded-xl cursor-not-allowed"
              >
                OUT OF STOCK
              </button>
            )}
          </form>
        ) : (
          <div className="bg-blue-600 text-white p-4 rounded-xl text-center font-bold">
            SẮP MỞ BÁN: {new Date(flashSale.startDate).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default IphoneFlashSale;
