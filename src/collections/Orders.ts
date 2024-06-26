import { Access, CollectionConfig } from 'payload/types'

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    user: {
      equals: user?.id,
    },
  }
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Your Orders',
    description:
      'A summary of all your orders on Harbour.io .',
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
    create: ({ req }) => req.user.role === 'admin',
  },
  fields: [
    {
      name: '_isPaid',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: ({ req }) => req.user.role === 'admin',
        create: () => false,
        update: () => false,
      },
      required: true,
    },
    {
      name: 'base64',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
      },
      access: {
        read: ({ req }) => req.user.role === 'admin',
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'user',
      type: 'relationship',
	  access: {
        read: ({ req }) => req.user.role === 'admin',
        create: () => false,
        update: () => false,
      },
      relationTo: 'users',
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true,
    },
  ],
}