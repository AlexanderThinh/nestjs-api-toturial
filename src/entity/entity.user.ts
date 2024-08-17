import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BookmarkEntity } from './entity.bookmark';
import { UserRole } from 'src/enum/user-role';

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: true})
    firstName: string;

    @Column({ length: 255, nullable: true })
    lastName: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    hash: string;

    @Column({ 
        type: 'enum',
        enum: UserRole })
    role: UserRole;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
    bookmarks: BookmarkEntity[];
}