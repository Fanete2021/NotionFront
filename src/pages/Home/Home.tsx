import { Header } from '@widgets/Header';

export const HomePage = () => {
  return (
    <main>
      <Header />
      <section style={{ padding: '24px' }}>
        <h1>Добро пожаловать</h1>
        <p>Это базовая структура Feature-Sliced Design для Next.js.</p>
      </section>
    </main>
  );
};
