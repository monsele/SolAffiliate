
export type AffiliateDapp = {
  version: "0.1.0";
  name: "affiliate_dapp";
  address: string;
  metadata: any;
  instructions: [
    {
      name: "createAffiliateLink";
      accounts: [
        {
          name: "affiliateLink";
          isMut: true;
          isSigner: false;
        },
        {
          name: "campaign";
          isMut: true;
          isSigner: false;
        },
        {
          name: "influencer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "campaignName";
          type: "string";
        }
      ];
    },
    {
      name: "createNftCampaign";
      accounts: [
        {
          name: "company";
          isMut: true;
          isSigner: true;
        },
        {
          name: "campaign";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "projectTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftEscrow";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowPdaNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "mintPrice";
          type: "u64";
        },
        {
          name: "commissionPercentage";
          type: "u8";
        },
        {
          name: "campaignDetails";
          type: "string";
        }
      ];
    },
    {
      name: "processAffiliateMint";
      accounts: [
        {
          name: "campaign";
          isMut: true;
          isSigner: false;
        },
        {
          name: "affiliateLink";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "influencer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "nftEscrow";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buyerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ownerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowPdaNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "marketplaceAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "campaignName";
          type: "string";
        },
        {
          name: "influencer";
          type: "publicKey";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "affiliateLink";
      type: {
        kind: "struct";
        fields: [
          {
            name: "campaign";
            type: "publicKey";
          },
          {
            name: "influencer";
            type: "publicKey";
          },
          {
            name: "mintsCount";
            type: "u64";
          },
          {
            name: "earnings";
            type: "u64";
          },
          {
            name: "createdAt";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "nftCampaign";
      type: {
        kind: "struct";
        fields: [
          {
            name: "nftMint";
            type: "publicKey";
          },
          {
            name: "company";
            type: "publicKey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "mintPrice";
            type: "u64";
          },
          {
            name: "commissionPercentage";
            type: "u8";
          },
          {
            name: "campaignDetails";
            type: "string";
          },
          {
            name: "active";
            type: "bool";
          },
          {
            name: "affiliatesCount";
            type: "u64";
          },
          {
            name: "totalMints";
            type: "u64";
          },
          {
            name: "createdAt";
            type: "i64";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "ListingCreatedEvent";
      fields: [
        {
          name: "listing";
          type: "publicKey";
          index: false;
        },
        {
          name: "seller";
          type: "publicKey";
          index: false;
        },
        {
          name: "nftMint";
          type: "publicKey";
          index: false;
        },
        {
          name: "price";
          type: "u64";
          index: false;
        },
        {
          name: "createdAt";
          type: "i64";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidInfluencer";
      msg: "Wrong Influencer";
    },
    {
      code: 6001;
      name: "InvalidAccountOwner";
      msg: "Wrong Owner Account";
    },
    {
      code: 6002;
      name: "InvalidPrice";
      msg: "Price should not be negative";
    }
  ];
};

// TypeDef is not available from @coral-xyz/anchor, so these exports are commented out or need to be replaced with appropriate types.
// export type AffiliateLink = TypeDef<AffiliateDapp["accounts"][0], IdlTypes<AffiliateDapp>>;
// export type NFTCampaign = TypeDef<AffiliateDapp["accounts"][1], IdlTypes<AffiliateDapp>>;
// export type ListingCreatedEvent = TypeDef<AffiliateDapp["events"][0], IdlTypes<AffiliateDapp>>;