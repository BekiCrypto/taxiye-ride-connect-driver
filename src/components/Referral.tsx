
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Gift, Users, DollarSign } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface PromoCode {
  id: string;
  code: string;
  driver_bonus: number;
  expiry_date: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
}

interface PromoRedemption {
  id: string;
  promo_code_id: string;
  amount_credited: number;
  redeemed_at: string;
}

const Referral = () => {
  const { driver } = useDriverAuth();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [redemptions, setRedemptions] = useState<PromoRedemption[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  const referralCode = `TAXIYE${driver?.phone?.slice(-4) || '0000'}`;
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  useEffect(() => {
    fetchPromoCodes();
    fetchRedemptions();
  }, []);

  const fetchPromoCodes = async () => {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching promo codes:', error);
    } else if (data) {
      setPromoCodes(data as PromoCode[]);
    }
    setLoading(false);
  };

  const fetchRedemptions = async () => {
    if (!driver) return;

    const { data, error } = await supabase
      .from('promo_redemptions')
      .select('*')
      .eq('driver_phone_ref', driver.phone)
      .order('redeemed_at', { ascending: false });

    if (error) {
      console.error('Error fetching redemptions:', error);
    } else if (data) {
      setRedemptions(data as PromoRedemption[]);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Taxiye as a Driver',
        text: 'Join me on Taxiye and start earning as a driver!',
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  const redeemPromoCode = async () => {
    if (!promoCodeInput.trim()) {
      toast({
        title: "Enter Promo Code",
        description: "Please enter a valid promo code",
        variant: "destructive"
      });
      return;
    }

    if (!driver) return;

    setRedeeming(true);

    // Find the promo code
    const promoCode = promoCodes.find(p => p.code.toLowerCase() === promoCodeInput.toLowerCase());
    
    if (!promoCode) {
      toast({
        title: "Invalid Code",
        description: "Promo code not found or expired",
        variant: "destructive"
      });
      setRedeeming(false);
      return;
    }

    if (promoCode.current_uses >= promoCode.max_uses) {
      toast({
        title: "Code Exhausted",
        description: "This promo code has reached its usage limit",
        variant: "destructive"
      });
      setRedeeming(false);
      return;
    }

    if (new Date(promoCode.expiry_date) < new Date()) {
      toast({
        title: "Code Expired",
        description: "This promo code has expired",
        variant: "destructive"
      });
      setRedeeming(false);
      return;
    }

    // Check if already redeemed
    const alreadyRedeemed = redemptions.some(r => r.promo_code_id === promoCode.id);
    if (alreadyRedeemed) {
      toast({
        title: "Already Redeemed",
        description: "You have already used this promo code",
        variant: "destructive"
      });
      setRedeeming(false);
      return;
    }

    // Redeem the code
    const { data, error } = await supabase
      .from('promo_redemptions')
      .insert({
        promo_code_id: promoCode.id,
        driver_phone_ref: driver.phone,
        amount_credited: promoCode.driver_bonus
      })
      .select()
      .single();

    if (error) {
      console.error('Error redeeming promo code:', error);
      toast({
        title: "Redemption Failed",
        description: "Failed to redeem promo code. Please try again.",
        variant: "destructive"
      });
    } else {
      // Update promo code usage
      await supabase
        .from('promo_codes')
        .update({ current_uses: promoCode.current_uses + 1 })
        .eq('id', promoCode.id);

      // Add to wallet
      const { error: walletError } = await supabase
        .from('wallet_transactions')
        .insert({
          driver_phone_ref: driver.phone,
          type: 'promo_credit',
          amount: promoCode.driver_bonus,
          description: `Promo code bonus: ${promoCode.code}`,
          status: 'completed'
        });

      if (walletError) {
        console.error('Error adding to wallet:', walletError);
      }

      toast({
        title: "Promo Redeemed! 🎉",
        description: `${promoCode.driver_bonus} ETB credited to your wallet`,
      });

      setPromoCodeInput('');
      fetchPromoCodes();
      fetchRedemptions();
    }

    setRedeeming(false);
  };

  const totalEarned = redemptions.reduce((sum, redemption) => sum + redemption.amount_credited, 0);

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white">Refer & Earn</h1>

      {/* Referral Section */}
      <Card className="bg-gradient-to-r from-green-800 to-green-600 border-green-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">{referralCode}</div>
              <div className="text-green-100 text-sm">Share this code with new drivers</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={copyReferralLink}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={shareReferralLink}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="text-center text-green-100 text-sm">
            Earn bonus for each successful referral!
          </div>
        </CardContent>
      </Card>

      {/* Promo Code Redemption */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Gift className="h-5 w-5 mr-2" />
            Redeem Promo Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter promo code"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button
              onClick={redeemPromoCode}
              disabled={redeeming || !promoCodeInput.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {redeeming ? 'Redeeming...' : 'Redeem'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Promo Codes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Available Promo Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-gray-400">Loading promo codes...</div>
          ) : promoCodes.length === 0 ? (
            <div className="text-gray-400">No active promo codes available</div>
          ) : (
            promoCodes.map((promo) => (
              <div key={promo.id} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-green-400 font-bold">{promo.code}</div>
                    <div className="text-white">+{promo.driver_bonus} ETB bonus</div>
                    <div className="text-gray-400 text-sm">
                      Expires: {new Date(promo.expiry_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-500 text-gray-300">
                    {promo.current_uses}/{promo.max_uses} used
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Redemption History */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>My Redemptions</span>
            <Badge className="bg-green-600 text-white">
              Total: {totalEarned.toFixed(2)} ETB
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {redemptions.length === 0 ? (
            <div className="text-gray-400">No redemptions yet</div>
          ) : (
            redemptions.map((redemption) => (
              <div key={redemption.id} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">
                      +{redemption.amount_credited} ETB
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(redemption.redeemed_at).toLocaleDateString()}
                    </div>
                  </div>
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Referral;
