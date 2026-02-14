import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import icFilter from "@/assets/imgs/icons/ic_filter.png";
import icArrowDown from "@/assets/imgs/icons/ic_arrow_down.png";
import { PriceFilterList } from "@/web/components/place/PriceFilterList";

export interface FilterBarProps {
  orderOptions: Array<{ value: string }>;
  order: string;
  onOrderSelect: (value: string) => void;

  filterOpenNow: boolean;
  onSelectOpenNow: () => void;
  onSelectAnyHour: () => void;

  scheduleFilter: "any" | "required" | "not-required";
  onSelectSchedule: (value: "any" | "required" | "not-required") => void;

  cities: string[];
  selectedCity: string | null;
  onSelectCity: (value: string | null) => void;

  priceOptions: string[];
  priceFilter: string | null;
  onSelectPrice: (value: string | null) => void;

  showSortingMenu: boolean;
  setShowSortingMenu: (value: boolean) => void;
  showHoursMenu: boolean;
  setShowHoursMenu: (value: boolean) => void;
  showScheduleMenu: boolean;
  setShowScheduleMenu: (value: boolean) => void;
  showCityMenu: boolean;
  setShowCityMenu: (value: boolean) => void;
  showPriceMenu: boolean;
  setShowPriceMenu: (value: boolean) => void;

  openNowLabelKey: string;
  openNowLabelDefault?: string;
  anyHourLabelKey: string;
  anyHourLabelDefault?: string;

  showCityFilter?: boolean;
  showPriceFilter?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  orderOptions,
  order,
  onOrderSelect,
  filterOpenNow,
  onSelectOpenNow,
  onSelectAnyHour,
  scheduleFilter,
  onSelectSchedule,
  cities,
  selectedCity,
  onSelectCity,
  priceOptions,
  priceFilter,
  onSelectPrice,
  showSortingMenu,
  setShowSortingMenu,
  showHoursMenu,
  setShowHoursMenu,
  showScheduleMenu,
  setShowScheduleMenu,
  showCityMenu,
  setShowCityMenu,
  showPriceMenu,
  setShowPriceMenu,
  openNowLabelKey,
  openNowLabelDefault,
  anyHourLabelKey,
  anyHourLabelDefault,
  showCityFilter,
  showPriceFilter,
}) => {
  const { t } = useTranslation();

  const rootRef = useRef<HTMLDivElement | null>(null);

  const shouldShowCityFilter = typeof showCityFilter === "boolean" ? showCityFilter : cities.length > 1;
  const shouldShowPriceFilter = typeof showPriceFilter === "boolean" ? showPriceFilter : priceOptions.length > 1;

  const closeAllMenus = () => {
    setShowSortingMenu(false);
    setShowHoursMenu(false);
    setShowScheduleMenu(false);
    setShowCityMenu(false);
    setShowPriceMenu(false);
  };

  useEffect(() => {
    function handleDocumentClick(e: Event) {
      const target = e.target as Node | null;
      if (!rootRef.current) return;
      if (target && !rootRef.current.contains(target)) {
        closeAllMenus();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Esc') closeAllMenus();
    }

    // Always listen for outside clicks/touches and Esc to reliably close menus
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
      <div className="mx-auto max-w-5xl px-4 sm:px-12 py-4 text-black">
        <div className="flex flex-col justify-start gap-2">
          <div className="flex items-center">
            <img src={icFilter} alt="filter" className="w-4 h-4 mr-2" />
            <h3 className="font-bold text-lg text-black">{t("filters.title", { defaultValue: "Filtros" })}</h3>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex flex-wrap items-center gap-2 w-full">
              {/* Ordenação */}
              <div className="relative">
                <button
                  type="button"
                  className="btn-square px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                  style={{ background: "#F5F5F5", borderColor: "#403E44", color: "#0F0D13" }}
                  onClick={() => {
                    const next = !showSortingMenu;
                    closeAllMenus();
                    setShowSortingMenu(next);
                  }}
                >
                  <span className="mr-2">{t("filters.sortingTitle")}</span>
                  <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                </button>
                {showSortingMenu && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
                    {orderOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${order === opt.value ? "font-semibold" : ""}`}
                        onClick={() => {
                          onOrderSelect(opt.value);
                          setShowSortingMenu(false);
                        }}
                      >
                        {opt.value === "name-asc" && t("list.orderNameAsc")}
                        {opt.value === "neighborhood-asc" && t("list.orderNeighborhoodAsc")}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Horários */}
              <div className="relative">
                <button
                  type="button"
                  className="btn-square px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                  style={{ background: "#F5F5F5", borderColor: "#403E44", color: "#0F0D13" }}
                  onClick={() => {
                    const next = !showHoursMenu;
                    closeAllMenus();
                    setShowHoursMenu(next);
                  }}
                >
                  <span className="mr-2">{t("filters.hoursTitle", { defaultValue: "Horários" })}</span>
                  <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                </button>
                {showHoursMenu && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <button
                      type="button"
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${filterOpenNow ? "font-semibold" : ""}`}
                      onClick={() => {
                        onSelectOpenNow();
                        setShowHoursMenu(false);
                      }}
                    >
                      {t(openNowLabelKey, { defaultValue: openNowLabelDefault })}
                    </button>
                    <button
                      type="button"
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${!filterOpenNow ? "font-semibold" : ""}`}
                      onClick={() => {
                        onSelectAnyHour();
                        setShowHoursMenu(false);
                      }}
                    >
                      {t(anyHourLabelKey, { defaultValue: anyHourLabelDefault })}
                    </button>
                  </div>
                )}
              </div>

              {/* Agendar */}
              <div className="relative">
                <button
                  type="button"
                  className="btn-square px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                  style={{ background: "#F5F5F5", borderColor: "#403E44", color: "#0F0D13" }}
                  onClick={() => {
                    const next = !showScheduleMenu;
                    closeAllMenus();
                    setShowScheduleMenu(next);
                  }}
                >
                  <span className="mr-2">{t("filters.scheduleTitle", { defaultValue: "Agendar" })}</span>
                  <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                </button>
                {showScheduleMenu && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <button
                      type="button"
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${scheduleFilter === "required" ? "font-semibold" : ""}`}
                      onClick={() => {
                        onSelectSchedule("required");
                        setShowScheduleMenu(false);
                      }}
                    >
                      {t("filters.scheduleRequired", { defaultValue: "Necessário agendar" })}
                    </button>
                    <button
                      type="button"
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${scheduleFilter === "not-required" ? "font-semibold" : ""}`}
                      onClick={() => {
                        onSelectSchedule("not-required");
                        setShowScheduleMenu(false);
                      }}
                    >
                      {t("filters.scheduleNotRequired", { defaultValue: "Não precisa agendar" })}
                    </button>
                    <button
                      type="button"
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${scheduleFilter === "any" ? "font-semibold" : ""}`}
                      onClick={() => {
                        onSelectSchedule("any");
                        setShowScheduleMenu(false);
                      }}
                    >
                      {t("filters.anySchedule", { defaultValue: "Qualquer" })}
                    </button>
                  </div>
                )}
              </div>

              {/* Cidade */}
              {shouldShowCityFilter && (
                <div className="relative">
                  <button
                    type="button"
                    className="btn-square px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                    style={{ background: "#F5F5F5", borderColor: "#403E44", color: "#0F0D13" }}
                    onClick={() => {
                      const next = !showCityMenu;
                      closeAllMenus();
                      setShowCityMenu(next);
                    }}
                  >
                    <span className="mr-2">{t("filters.cityTitle", { defaultValue: "Cidade" })}</span>
                    <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                  </button>
                  {showCityMenu && (
                    <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
                      <button
                        type="button"
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedCity === null ? "font-semibold" : ""}`}
                        onClick={() => {
                          onSelectCity(null);
                          setShowCityMenu(false);
                        }}
                      >
                        {t("filters.anyCity", { defaultValue: "Qualquer cidade" })}
                      </button>
                      {cities.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedCity === c ? "font-semibold" : ""}`}
                          onClick={() => {
                            onSelectCity(c);
                            setShowCityMenu(false);
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Preço */}
              {shouldShowPriceFilter && (
                <div className="relative">
                  <button
                    type="button"
                    className="btn-square px-3 py-2 rounded border font-bold text-xs flex items-center justify-between"
                    style={{ background: "#F5F5F5", borderColor: "#403E44", color: "#0F0D13" }}
                    onClick={() => {
                      const next = !showPriceMenu;
                      closeAllMenus();
                      setShowPriceMenu(next);
                    }}
                  >
                    <span className="mr-2">{t("filters.priceTitle", { defaultValue: "Preço" })}</span>
                    <img src={icArrowDown} alt="expand" className="w-3 h-3" />
                  </button>
                  {showPriceMenu && (
                    <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
                      <PriceFilterList
                        options={priceOptions}
                        selected={priceFilter}
                        anyLabel={t("filters.anyPrice", { defaultValue: "Qualquer preço" })}
                        onSelect={(v) => {
                          onSelectPrice(v);
                          setShowPriceMenu(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
