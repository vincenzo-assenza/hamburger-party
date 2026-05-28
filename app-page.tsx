// app/page.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc-client';
import styles from './page.module.css';

interface Ingredients {
  lettuce: boolean;
  tomato: boolean;
  cheese: boolean;
  fries: boolean;
}

const INGREDIENTS = [
  { key: 'lettuce', label: 'Lattuga', icon: '🥬', color: '#4CAF50' },
  { key: 'tomato', label: 'Pomodoro', icon: '🍅', color: '#FF5722' },
  { key: 'cheese', label: 'Formaggio', icon: '🧀', color: '#FFC107' },
  { key: 'fries', label: 'Patatine', icon: '🍟', color: '#FF9800' },
] as const;

const DONENESS = [
  { value: 'rare' as const, label: 'Al sangue', icon: '🔴' },
  { value: 'medium' as const, label: 'Media', icon: '🟠' },
  { value: 'well_done' as const, label: 'Ben cotta', icon: '🟤' },
];

export default function OrderPage() {
  const [friendName, setFriendName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredients>({
    lettuce: false,
    tomato: false,
    cheese: false,
    fries: false,
  });
  const [doneness, setDoneness] = useState<'rare' | 'medium' | 'well_done'>('medium');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const createOrder = trpc.orders.create.useMutation();

  const handleIngredientToggle = (key: keyof Ingredients) => {
    setIngredients((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!friendName.trim()) {
      setError('Inserisci il tuo nome!');
      inputRef.current?.focus();
      return;
    }

    try {
      await createOrder.mutateAsync({
        friendName: friendName.trim(),
        ingredients,
        meatDoneness: doneness,
      });

      setSubmitted(true);
      setTimeout(() => {
        setFriendName('');
        setIngredients({ lettuce: false, tomato: false, cheese: false, fries: false });
        setDoneness('medium');
        setSubmitted(false);
        inputRef.current?.focus();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Errore nell\'ordine');
    }
  };

  const selectedCount = Object.values(ingredients).filter(Boolean).length;

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>🍔 Hamburger Party</h1>
        <p className={styles.subtitle}>Personalizza il tuo hamburger</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* NOME */}
            <motion.div
              className={styles.section}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className={styles.label}>Chi sei?</label>
              <input
                ref={inputRef}
                type="text"
                value={friendName}
                onChange={(e) => {
                  setFriendName(e.target.value);
                  setError('');
                }}
                placeholder="Inserisci il tuo nome..."
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                maxLength={50}
                autoFocus
              />
              {error && <span className={styles.errorText}>{error}</span>}
            </motion.div>

            {/* INGREDIENTI */}
            <motion.div
              className={styles.section}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className={styles.label}>
                Ingredienti ({selectedCount}/4)
              </label>
              <div className={styles.ingredientsGrid}>
                {INGREDIENTS.map(({ key, label, icon, color }) => (
                  <motion.button
                    key={key}
                    type="button"
                    className={`${styles.ingredientBtn} ${
                      ingredients[key as keyof Ingredients] ? styles.selected : ''
                    }`}
                    onClick={() => handleIngredientToggle(key as keyof Ingredients)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      ingredients[key as keyof Ingredients]
                        ? { boxShadow: `0 0 20px ${color}80` }
                        : { boxShadow: '0 0 0px transparent' }
                    }
                  >
                    <span className={styles.ingredientIcon}>{icon}</span>
                    <span className={styles.ingredientLabel}>{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* COTTURA */}
            <motion.div
              className={styles.section}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className={styles.label}>Cottura della carne</label>
              <div className={styles.donenessGrid}>
                {DONENESS.map(({ value, label, icon }) => (
                  <motion.button
                    key={value}
                    type="button"
                    className={`${styles.donenessBtn} ${
                      doneness === value ? styles.selected : ''
                    }`}
                    onClick={() => setDoneness(value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.donenessIcon}>{icon}</span>
                    <span className={styles.donenessLabel}>{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* SUBMIT */}
            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={createOrder.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {createOrder.isPending ? 'Salvataggio...' : 'Ordina il tuo burger 🎉'}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className={styles.successMessage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className={styles.successIcon}
            >
              🍔
            </motion.div>
            <h2 className={styles.successTitle}>Perfetto!</h2>
            <p className={styles.successText}>
              L'ordine di <strong>{friendName}</strong> è stato salvato!
            </p>
            <p className={styles.successSubtext}>Preparati a una serata gustosa 😋</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
