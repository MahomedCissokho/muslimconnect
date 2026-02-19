import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants';
import { RECITERS, type ReciterInfo } from '../data/reciters';

// ─── Reciter avatar: photo if available, colored circle with Arabic initial otherwise

function ReciterAvatar({ reciter }: { reciter: ReciterInfo }) {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (reciter.photoUrl && !photoFailed) {
    return (
      <Image
        source={{ uri: reciter.photoUrl }}
        style={styles.avatarImg}
        onError={() => setPhotoFailed(true)}
      />
    );
  }

  return (
    <View style={[styles.avatar, { backgroundColor: reciter.color }]}>
      <Text style={styles.avatarText}>{reciter.nameAr.charAt(0)}</Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReciterSelectorProps {
  visible: boolean;
  selectedId: string;
  onSelect: (reciterId: string) => void;
  onClose: () => void;
}

export const ReciterSelector: React.FC<ReciterSelectorProps> = ({
  visible,
  selectedId,
  onSelect,
  onClose,
}) => {
  const { t, i18n } = useTranslation();

  const getReciterName = (reciter: ReciterInfo): string => {
    return i18n.language === 'fr' ? reciter.nameFr : reciter.nameEn;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('audio.selectReciter')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {RECITERS.map((reciter) => {
              const isSelected = reciter.id === selectedId;
              return (
                <TouchableOpacity
                  key={reciter.id}
                  style={[styles.reciterItem, isSelected && styles.reciterItemSelected]}
                  onPress={() => {
                    onSelect(reciter.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <ReciterAvatar reciter={reciter} />

                  <View style={styles.reciterInfo}>
                    <Text style={styles.reciterName}>{getReciterName(reciter)}</Text>
                    <Text style={styles.reciterArabic}>{reciter.nameAr}</Text>
                    <Text style={styles.reciterStyle}>
                      {reciter.style === 'murattal' ? t('audio.murattal') : t('audio.mujawwad')}
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.gold} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.blackAlpha50,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    maxHeight: '75%',
    paddingBottom: SPACING['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  reciterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reciterItemSelected: {
    backgroundColor: COLORS.whiteAlpha15,
  },
  // Shared size for both photo and avatar
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.lg,
    backgroundColor: COLORS.secondary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  avatarText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
  reciterInfo: {
    flex: 1,
  },
  reciterName: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  reciterArabic: {
    color: COLORS.gray300,
    fontFamily: FONTS.arabic,
    fontSize: 14,
    marginTop: 2,
  },
  reciterStyle: {
    color: COLORS.gold,
    fontFamily: FONTS.medium,
    fontSize: 11,
    marginTop: 2,
  },
});
