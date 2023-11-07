import { useEffect, useState } from 'react';
import '../styles/globals.css';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { Provider, useSelector } from 'react-redux';
import RouteGuard from '../components/RouteGuard';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';
import { Toaster } from 'react-hot-toast';

export default function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [isLogin, setIsLogin] = useState(false);

	useEffect(() => {
		// // console.log("Router changed", router.asPath);
		// // console.log('ini adalah router apa', Component)
		const publicPaths = ['/login'];
		const path = router.asPath.split('?')[0];

		if (publicPaths.includes(path)) {
			setIsLogin(true);
		} else {
			setIsLogin(false);
		}
	}, [router.asPath])

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<RouteGuard>
					{isLogin && (
						<>
							<Component {...pageProps} />
							<Toaster
								position="top-center"
								reverseOrder={true}
							/>
						</>
					)}
					{!isLogin && (
						<DashboardLayout>
							<Toaster
								position="top-center"
								reverseOrder={true}
							/>
							<Component {...pageProps} />
						</DashboardLayout>
					)}
				</RouteGuard>
			</PersistGate>
		</Provider>
	);
}