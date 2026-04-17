import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ACCESS_TOKEN } from "../constants";
import ConfirmModal from "../components/ConfirmModal";
import { Check, X, Shield, ShieldOff, Search } from "lucide-react";

const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/user-approvals`;

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-32">
    <div className="w-12 h-12 border-4 border-t-[#afe5e6] border-b-[#6d8f91] border-l-transparent border-r-transparent rounded-full animate-spin" />
  </div>
);

const statusBadge = (item) => {
  if (item.is_active) {
    return (
      <span className="py-1 px-3 rounded-full text-xs font-semibold bg-green-800/40 text-green-300 border border-green-600/40">
        AKTYWNY
      </span>
    );
  }
  if (item.email_confirmed) {
    return (
      <span className="py-1 px-3 rounded-full text-xs font-semibold bg-yellow-800/40 text-yellow-300 border border-yellow-600/40">
        OCZEKUJE ZATWIERDZENIA
      </span>
    );
  }
  return (
    <span className="py-1 px-3 rounded-full text-xs font-semibold bg-red-900/40 text-red-300 border border-red-600/40">
      EMAIL NIEPOTWIERDZONY
    </span>
  );
};

const UserApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchApprovals = useCallback(
    async (reset = false) => {
      if (loading) return;
      if (!reset && !hasMore) return;

      setLoading(true);
      const token = localStorage.getItem(ACCESS_TOKEN);
      const nextPage = reset ? 1 : page;

      try {
        const res = await axios.get(`${apiUrl}/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: nextPage, status: statusFilter, search: search || undefined },
        });

        setApprovals((prev) => {
          const incoming = res.data.results || [];
          if (reset) return incoming;
          return [...prev, ...incoming.filter((n) => !prev.some((p) => p.id === n.id))];
        });
        setHasMore(!!res.data.next);
        setPage(reset ? 2 : nextPage + 1);
      } catch (err) {
        console.error("Błąd pobierania zatwierdzeń:", err);
        if (err.response?.status === 403) {
          toast.error("Brak uprawnień do tego widoku.");
        } else {
          toast.error("Nie udało się pobrać listy użytkowników.");
        }
      } finally {
        setLoading(false);
      }
    },
    [hasMore, loading, page, statusFilter, search],
  );

  useEffect(() => {
    setApprovals([]);
    setPage(1);
    setHasMore(true);
    fetchApprovals(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const runAction = async (item, action, description) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    setBusyId(item.id);
    try {
      const res = await axios.post(
        `${apiUrl}/${item.id}/action/`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setApprovals((prev) => prev.map((p) => (p.id === item.id ? res.data : p)));
      toast.success(`Wykonano: ${description}.`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || "Wystąpił błąd.";
      toast.error(`Nie udało się: ${msg}`);
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = (item) => {
    setConfirmAction({
      message: `Czy zatwierdzić konto użytkownika "${item.username}"?`,
      onConfirm: () => {
        setConfirmAction(null);
        runAction(item, "approve", "zatwierdzenie konta");
      },
    });
  };

  const handleRevoke = (item) => {
    setConfirmAction({
      message: `Czy cofnąć aktywację użytkownika "${item.username}"?`,
      onConfirm: () => {
        setConfirmAction(null);
        runAction(item, "revoke", "cofnięcie aktywacji");
      },
    });
  };

  const handlePromote = (item) => {
    setConfirmAction({
      message: `Nadać uprawnienia pracownika użytkownikowi "${item.username}"?`,
      onConfirm: () => {
        setConfirmAction(null);
        runAction(item, "promote_staff", "nadanie uprawnień pracownika");
      },
    });
  };

  const handleDemote = (item) => {
    setConfirmAction({
      message: `Odebrać uprawnienia pracownika użytkownikowi "${item.username}"?`,
      onConfirm: () => {
        setConfirmAction(null);
        runAction(item, "demote_staff", "odebranie uprawnień pracownika");
      },
    });
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setApprovals([]);
    setPage(1);
    setHasMore(true);
    fetchApprovals(true);
  };

  return (
    <div className="mt-8 bg-[#2a2b2b] p-8 rounded-xl mx-auto text-white shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-2 text-[#afe5e6]">
        Zatwierdzanie użytkowników
      </h1>
      <p className="text-gray-400 mb-6">
        Aktywuj konta oczekujące na zatwierdzenie i zarządzaj uprawnieniami pracowników.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "pending", label: "Oczekujące" },
            { key: "email_confirmed", label: "Potwierdzony email" },
            { key: "active", label: "Aktywne" },
            { key: "all", label: "Wszystkie" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === f.key
                  ? "bg-[#afe5e6] text-black"
                  : "bg-[#1e1f1f] text-[#d2e4e2] hover:bg-[#3c3d3d]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj po loginie lub e-mailu..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1e1f1f] border border-[#3c3d3d] text-sm focus:outline-none focus:border-[#afe5e6]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#afe5e6] text-black text-sm font-semibold hover:bg-[#92c5c6] transition"
          >
            Szukaj
          </button>
        </form>
      </div>

      <div className="max-h-[600px] overflow-y-auto custom-scroll pr-2">
        <div className="space-y-3">
          {approvals.length === 0 && !loading && (
            <p className="text-center text-gray-400 py-10">Brak użytkowników w tym widoku.</p>
          )}

          {approvals.map((item) => {
            const isBusy = busyId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[#1e1f1f] rounded-xl border border-[#3c3d3d] p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold truncate">{item.username}</span>
                    {statusBadge(item)}
                    {item.is_staff && (
                      <span className="py-1 px-2 rounded-full text-xs font-semibold bg-blue-800/40 text-blue-300 border border-blue-600/40">
                        PRACOWNIK
                      </span>
                    )}
                    {item.is_superuser && (
                      <span className="py-1 px-2 rounded-full text-xs font-semibold bg-purple-800/40 text-purple-300 border border-purple-600/40">
                        SUPERUSER
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 truncate">{item.email}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Rejestracja: {new Date(item.created_at).toLocaleString("pl-PL")}
                    {item.approved_at && (
                      <>
                        {" · "}
                        Zatwierdzono: {new Date(item.approved_at).toLocaleString("pl-PL")}
                        {item.approved_by_username && ` przez ${item.approved_by_username}`}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!item.is_active && (
                    <button
                      onClick={() => handleApprove(item)}
                      disabled={isBusy}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> Zatwierdź
                    </button>
                  )}
                  {item.is_active && !item.is_superuser && (
                    <button
                      onClick={() => handleRevoke(item)}
                      disabled={isBusy}
                      className="flex items-center gap-1 bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Cofnij aktywację
                    </button>
                  )}
                  {item.is_active && !item.is_staff && (
                    <button
                      onClick={() => handlePromote(item)}
                      disabled={isBusy}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Shield className="w-4 h-4" /> Nadaj rolę pracownika
                    </button>
                  )}
                  {item.is_active && item.is_staff && !item.is_superuser && (
                    <button
                      onClick={() => handleDemote(item)}
                      disabled={isBusy}
                      className="flex items-center gap-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-50"
                    >
                      <ShieldOff className="w-4 h-4" /> Odbierz rolę pracownika
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {loading && <LoadingSpinner />}

        {hasMore && !loading && approvals.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => fetchApprovals(false)}
              className="bg-[#afe5e6] text-black px-6 py-2 rounded font-semibold hover:bg-[#92c5c6] transition"
            >
              Załaduj więcej
            </button>
          </div>
        )}

        {!hasMore && approvals.length > 0 && (
          <p className="text-center text-gray-400 mt-6">Koniec listy.</p>
        )}
      </div>

      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};

export default UserApprovals;
