import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { RootStackParamList } from '../../navigation/types';

type SupportChatRouteProp = RouteProp<RootStackParamList, 'SupportChat'>;

export default function SupportChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<SupportChatRouteProp>();
  const { faqs, chatMessages, sendChatMessage } = useApp();

  const initialTab = route.params?.initialTab || 'chat';
  const [activeTab, setActiveTab] = useState<'faqs' | 'chat'>(initialTab);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [chatInput, setChatInput] = useState('');

  const handleSend = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.headerTitle}>Help & Live Chat</Text>
            <View style={styles.liveIndicatorBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveIndicatorText}>CONCIERGE ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>24/7 dedicated partner assistance desk</Text>
        </View>
      </View>

      {/* Mode Tabs: Live Chat vs FAQs */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'chat' && styles.tabBtnActive]}
          onPress={() => setActiveTab('chat')}
          accessibilityLabel="Open Live Chat"
        >
          <Ionicons
            name="chatbubbles"
            size={16}
            color={activeTab === 'chat' ? '#FFFFFF' : colors.primary}
          />
          <Text style={[styles.tabBtnText, activeTab === 'chat' && styles.tabBtnTextActive]}>
            Live Partner Chat
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabBtn, activeTab === 'faqs' && styles.tabBtnActive]}
          onPress={() => setActiveTab('faqs')}
          accessibilityLabel="Open FAQs"
        >
          <Ionicons
            name="help-circle-outline"
            size={16}
            color={activeTab === 'faqs' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text style={[styles.tabBtnText, activeTab === 'faqs' && styles.tabBtnTextActive]}>
            FAQs & Guides
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.containerWrap}
      >
        {/* Main Tab Area */}
        <View style={styles.tabContentArea}>
          {activeTab === 'chat' ? (
            <View style={{ flex: 1 }}>
              {/* Live Status Bar */}
              <View style={styles.chatStatusBar}>
                <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
                <Text style={styles.chatStatusBarText}>
                  Connected with Medical Partner Concierge • Typical reply time: Instant
                </Text>
              </View>

              <FlatList
                style={{ flex: 1 }}
                data={chatMessages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatListContent}
                renderItem={({ item }) => {
                  const isMe = item.sender === 'user';
                  return (
                    <View
                      style={[
                        styles.chatBubbleWrap,
                        isMe ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
                      ]}
                    >
                      <View
                        style={[
                          styles.chatBubble,
                          isMe
                            ? { backgroundColor: colors.primary, borderBottomRightRadius: 2 }
                            : { backgroundColor: colors.card, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: colors.borderLight },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chatText,
                            isMe ? { color: '#FFFFFF' } : { color: colors.text },
                          ]}
                        >
                          {item.text}
                        </Text>
                      </View>
                      <Text style={styles.chatTime}>{item.timestamp}</Text>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.faqContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Top Quick Chat Banner */}
              <Pressable
                style={styles.topChatBanner}
                onPress={() => setActiveTab('chat')}
                accessibilityLabel="Start Live Chat"
              >
                <View style={styles.topChatBannerIcon}>
                  <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.topChatBannerTitle}>Live Healthcare Concierge</Text>
                    <View style={styles.liveDotPill}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveDotText}>LIVE NOW</Text>
                    </View>
                  </View>
                  <Text style={styles.topChatBannerSub}>
                    Instant support for bookings, Rx verification & partner tools
                  </Text>
                </View>
                <View style={styles.topChatActionBtn}>
                  <Text style={styles.topChatActionText}>Chat</Text>
                  <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                </View>
              </Pressable>

              <View style={styles.faqHeroBox}>
                <Ionicons name="sparkles" size={18} color={colors.primary} />
                <Text style={styles.faqHeroText}>
                  Find quick answers to common questions about payouts, OP slot locking, digital prescriptions, and medicine delivery verification.
                </Text>
              </View>

              {faqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <Card key={faq.id} style={styles.faqCard}>
                    <Pressable
                      style={styles.faqQuestionRow}
                      onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    >
                      <View style={styles.faqIconPill}>
                        <Text style={styles.faqIconPillText}>{faq.category.slice(0, 3).toUpperCase()}</Text>
                      </View>
                      <Text style={styles.faqQuestionText}>{faq.question}</Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={colors.textSecondary}
                      />
                    </Pressable>

                    {isExpanded && (
                      <View style={styles.faqAnswerBox}>
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      </View>
                    )}
                  </Card>
                );
              })}

              <View style={styles.needMoreHelpCard}>
                <Text style={styles.needMoreHelpTitle}>Still have questions?</Text>
                <Text style={styles.needMoreHelpSub}>
                  Talk with our 24/7 dedicated partner operations concierge.
                </Text>
                <Pressable style={styles.openChatBtn} onPress={() => setActiveTab('chat')}>
                  <Ionicons name="chatbubbles" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.openChatBtnText}>Open Live Chat</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>

        {/* ALWAYS VISIBLE BOTTOM TYPING BAR */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputFieldContainer}>
            <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.chatTextInput}
              placeholder={
                activeTab === 'chat'
                  ? 'Ask about bookings, slots, orders, Rx...'
                  : 'Ask Live Concierge a question...'
              }
              placeholderTextColor={colors.textMuted}
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>
          <Pressable
            style={[styles.sendBtn, !chatInput.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            accessibilityLabel="Send Message"
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 8,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  liveIndicatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  chatStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  chatStatusBarText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabBtnActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  faqContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.sm,
  },
  topChatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: 12,
    marginBottom: spacing.xs,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  topChatBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topChatBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveDotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  liveDotText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  topChatBannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  topChatActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    gap: 2,
  },
  topChatActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  faqHeroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.xs,
  },
  faqHeroText: {
    flex: 1,
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
    fontWeight: '600',
  },
  faqCard: {
    padding: spacing.md,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faqIconPill: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  faqIconPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  faqAnswerBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  faqAnswerText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  needMoreHelpCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  needMoreHelpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  needMoreHelpSub: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  openChatBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  openChatBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatListContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  chatBubbleWrap: {
    marginVertical: 2,
  },
  chatBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.lg,
  },
  chatText: {
    fontSize: 13,
    lineHeight: 18,
  },
  chatTime: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    marginHorizontal: 4,
  },
  containerWrap: {
    flex: 1,
  },
  tabContentArea: {
    flex: 1,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 8,
  },
  inputFieldContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    paddingVertical: 0,
    height: '100%',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
});
