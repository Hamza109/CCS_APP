import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import { usePrefetchDistrictLitigationOfficers } from "../../src/hooks/useDistrictLitigationOfficers";
import { usePrefetchDlsaContacts } from "../../src/hooks/useDlsa";
import { usePrefetchLegalAidClinics } from "../../src/hooks/useLegalAidClinics";
import { usePrefetchLiteracyClubs } from "../../src/hooks/useLiteracyClubs";
import { usePrefetchParaLegalVolunteers } from "../../src/hooks/useParaLegalVolunteers";
import { usePrefetchProBonoLawyers } from "../../src/hooks/useProBonoLawyers";
import { usePrefetchSchemes } from "../../src/hooks/useSchemes";
import { useAppSelector } from "../../src/store";

const { width } = Dimensions.get("window");

const LegalAidScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "legal-aid-clinic",
      title: "Legal Aid Clinic",
      desc: "A Legal Aid Clinic is a center that provides free legal advice, assistance, and support to people who cannot afford legal services.",
    },
    {
      id: "pro-bono-advocates",
      title: "Contact no. of Pro Bono Advocates",
      desc: "Pro Bono Advocates are lawyers who voluntarily provide free legal services to people who cannot afford legal representation.",
    },
    {
      id: "district-litigation-offices",
      title: "Contact no. of District Litigation Offices",
      desc: "An office of law department at district level for representation of Govt cases and coordinates litigation matters at the district level.",
    },
    {
      id: "plv-list",
      title: "List of PARA LEGAL VOLUNTEER",
      desc: "A Para Legal Volunteer (PLV) is a trained community-level worker who assists people in accessing legal aid, spreading legal awareness, and facilitating justice delivery at the grassroots.",
    },
    {
      id: "slsa-dlsa-contacts",
      title: "Contact no. of SLSA/DLSA/Secretaries/HCLSC",
      desc: "SLSA (State Legal Services Authority), DLSA (District Legal Services Authority), Secretaries and HCLSC (High Court Legal Services Committee) provide free legal aid and awareness programs.",
    },
    {
      id: "jk-lsa-schemes",
      title: "Legal Aid Schemes in J&K LSA",
      desc: "Legal Aid Schemes are government-backed programs that ensure free legal services and access to justice for weaker and marginalized sections of society.",
    },
    {
      id: "llc-list",
      title: "Legal Litercay Clubs",
      desc: "Legal Literacy Clubs educate communities about their legal rights and responsibilities to promote justice and empowerment.",
    },
    {
      id: "ld-contact",
      title: "Contact with Law Department",
      desc: "Establishing communication with the government’s legal authority for advice, assistance, or resolution of legal issues.",
    },
  ];

  const prefetchClinics = usePrefetchLegalAidClinics();
  const prefetchProBonoLawyers = usePrefetchProBonoLawyers();
  const prefetchDistrictLitigationOfficers =
    usePrefetchDistrictLitigationOfficers();
  const prefetchParaLegalVolunteers = usePrefetchParaLegalVolunteers();
  const prefetchSchemes = usePrefetchSchemes();
  const prefetchLiteracyClubs = usePrefetchLiteracyClubs();
  const prefetchDlsaContacts = usePrefetchDlsaContacts();

  const renderItem = ({
    item,
  }: {
    item: { id: string; title: string; desc: string };
  }) => (
    <Card style={styles.infoCardVertical}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardAccent} />
        <Text
          style={[styles.infoCardTitle, theme === "dark" && styles.darkText]}
        >
          {item.title}
        </Text>
      </View>
      <Text
        style={[styles.infoCardDesc, theme === "dark" && styles.darkSubtext]}
      >
        {item.desc}
      </Text>
      <Button
        title='Explore More'
        onPress={() => {
          switch (item.id) {
            case "legal-aid-clinic":
              prefetchClinics();
              router.push(ROUTES.LEGAL_AID.CLINICS);
              break;
            case "pro-bono-advocates":
              prefetchProBonoLawyers();
              router.push(ROUTES.LEGAL_AID.PRO_BONO_LAWYERS);
              break;
            case "district-litigation-offices":
              prefetchDistrictLitigationOfficers();
              router.push(ROUTES.LEGAL_AID.DISTRICT_LITIGATION_OFFICERS);
              break;
            case "plv-list":
              prefetchParaLegalVolunteers();
              router.push(ROUTES.LEGAL_AID.PARA_LEGAL_VOLUNTEERS);
              break;
            case "slsa-dlsa-contacts":
              prefetchDlsaContacts();
              router.push(ROUTES.LEGAL_AID.DLSA_CONTACTS);
              break;
            case "jk-lsa-schemes":
              prefetchSchemes();
              router.push(ROUTES.LEGAL_AID.JK_LSA_SCHEMES);
              break;
            case "ld-contact":
              router.push({
                pathname: ROUTES.LEGAL_AID.CONTACT_FORM,
                params: { type: "law" },
              } as any);
              break;
            case "llc-list":
              prefetchLiteracyClubs();
              router.push(ROUTES.LEGAL_AID.LITERACY_CLUBS);
              break;
            default:
              break;
          }
        }}
        style={styles.exploreButton}
        textStyle={styles.exploreButtonText}
      />
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      {/* Blue Header */}
      <BlueHeader
        title='Legal Aid & Advice'
        subtitle='Find legal assistance and resources'
      />

      {/* Main Content */}
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <FlashList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flashListContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main Containers
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },

  darkText: {
    color: "#FFFFFF",
  },
  darkSubtext: {
    color: "#8E8E93",
  },

  flashListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Card styles
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoCardAccent: {
    width: 3,
    height: 20,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    marginRight: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
  },
  infoCardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 12,
  },
  infoCardVertical: {
    marginBottom: 12,
    padding: 16,
  },

  // Explore button styles
  exploreButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFC701",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0,
  },
  exploreButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default LegalAidScreen;
