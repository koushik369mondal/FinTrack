import { useEffect } from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import PageLoader from '@/components/PageLoader'
import { styles } from '@/assets/styles/home.styles'
import { Image } from 'react-native'

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(
    user.id
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // console.log("userId:", user.id);
  // console.log("Transactions:", transactions);
  // console.log("Summary:", summary);

  if (isLoading) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER  */}
        <View style={styles.header}>
          {/* LEFT  */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          {/* RIGHT   */}
        </View>
      </View>
    </View>
  )
}