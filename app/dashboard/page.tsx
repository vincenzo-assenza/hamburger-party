// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc-client';
import styles from './page.module.css';

interface Order {
  id: number;
  friendName: string;
  ingredients: {
    lettuce: boolean;
    tomato: boolean;
    cheese: boolean;
    fries: boolean;
  };
  meatDoneness: 'rare' | 'medium' | 'well_done';
  createdAt: string;
}

const INGREDIENTS_LABELS: Record<string, { icon: string; label: string }> = {
  lettuce: { icon: '🥬', label: 'Lattuga' },
  tomato: { icon: '🍅', label: 'Pomodoro' },
  cheese: { icon: '🧀', label: 'Formaggio' },
  fries: { icon: '🍟', label: 'Patatine' },
};

const DONENESS_INFO: Record<string, { icon: string; label: string }> = {
  rare: { icon: '🔴', label: 'Al sangue' },
  medium: { icon: '🟠', label: 'Media' },
  well_done: { icon: '🟤', label: 'Ben cotta' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ordersQuery = trpc.orders.getAll.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const deleteOrder = trpc.orders.delete.useMutation({
    onSuccess: () => ordersQuery.refetch(),
  });

  // Verifica token locale
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    setIsLoading(false);
  }, []);

  // OAuth handler (simulated - usa library reale: next-auth o google-auth-library)
  const handleGoogleLogin = () => {
    // In produzione: usa NextAuth.js o @react-oauth/google
    // Fallback dev: simula login
    const mockUser = {
      email: 'demo@example.com',
      name: 'Demo User',
    };

    localStorage.setItem('auth_token', 'mock-token-demo');
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={styles.spinner}
        >
          🍔
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <motion.div
          className={styles.loginCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.loginTitle}>Accedi alla Dashboard</h1>
          <p className={styles.loginSubtitle}>Solo per il proprietario</p>
          <motion.button
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🔐</span> Accedi con Google
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const orders = ordersQuery.data || [];

  return (
    <div className={styles.container}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>🍔 Dashboard Ordini</h1>
          <p className={styles.userInfo}>Ciao, {user?.name}!</p>
        </div>
        <motion.button
          className={styles.logoutBtn}
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Esci
        </motion.button>
      </motion.header>

      <motion.div
        className={styles.stats}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.statBox}>
          <span className={styles.statValue}>{orders.length}</span>
          <span className={styles.statLabel}>Ordini totali</span>
        </div>
      </motion.div>

      {ordersQuery.isLoading ? (
        <div className={styles.loadingState}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🍔
          </motion.div>
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className={styles.emptyIcon}>🎉</p>
          <h2 className={styles.emptyTitle}>Nessun ordine ancora</h2>
          <p className={styles.emptySubtitle}>
            Gli amici inizieranno a ordinare presto!
          </p>
        </motion.div>
      ) : (
        <motion.div
          className={styles.ordersList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className={styles.orderCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className={styles.orderHeader}>
                  <div className={styles.orderName}>{order.friendName}</div>
                  <span className={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className={styles.orderDetails}>
                  <div className={styles.section}>
                    <p className={styles.sectionTitle}>Ingredienti:</p>
                    <div className={styles.ingredients}>
                      {Object.entries(order.ingredients).map(([key, selected]) =>
                        selected ? (
                          <span key={key} className={styles.ingredient}>
                            {INGREDIENTS_LABELS[key].icon}{' '}
                            {INGREDIENTS_LABELS[key].label}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>

                  <div className={styles.section}>
                    <p className={styles.sectionTitle}>Cottura:</p>
                    <span className={styles.doneness}>
                      {DONENESS_INFO[order.meatDoneness].icon}{' '}
                      {DONENESS_INFO[order.meatDoneness].label}
                    </span>
                  </div>
                </div>

                <motion.button
                  className={styles.deleteBtn}
                  onClick={() => deleteOrder.mutate({ id: order.id })}
                  disabled={deleteOrder.isPending}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {orders.length > 0 && (
        <motion.button
          className={styles.startCookingBtn}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔥 Inizia a cucinare! ({orders.length} burger)
        </motion.button>
      )}
    </div>
  );
}
