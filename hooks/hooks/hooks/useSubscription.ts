import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export function useSubscription() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setIsPro(false);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setIsPro(doc.data()?.isPro || false);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { isPro, loading };
}
