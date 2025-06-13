
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { adminService } from '../../services/AdminService';
import { ProductVerification, KycVerification } from '../../models/internal/Admin';
import { toast } from '@/hooks/use-toast';

const AdminRequests: React.FC = () => {
  const [productVerifications, setProductVerifications] = useState<ProductVerification[]>([]);
  const [kycVerifications, setKycVerifications] = useState<KycVerification[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<ProductVerification | KycVerification | null>(null);
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      const [productData, kycData] = await Promise.all([
        adminService.getPendingProductVerifications(),
        adminService.getPendingKycVerifications(),
      ]);
      setProductVerifications(productData);
      setKycVerifications(kycData);
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verification requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductVerification = async (verificationId: string, status: 'approved' | 'rejected') => {
    try {
      await adminService.verifyProduct(verificationId, status);
      await fetchVerifications();
      setComments('');
      setSelectedVerification(null);
      toast({
        title: "Success",
        description: `Product ${status} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product verification",
        variant: "destructive",
      });
    }
  };

  const handleKycVerification = async (verificationId: string, status: 'approved' | 'rejected') => {
    try {
      await adminService.verifyKyc(verificationId, status, comments);
      await fetchVerifications();
      setComments('');
      setSelectedVerification(null);
      toast({
        title: "Success",
        description: `KYC ${status} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update KYC verification",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">
            Product Verifications ({productVerifications.length})
          </TabsTrigger>
          <TabsTrigger value="kyc">
            KYC Verifications ({kycVerifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Verification Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Company ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className="font-medium">{verification.productId.slice(-8)}</TableCell>
                      <TableCell>{verification.companyId.slice(-8)}</TableCell>
                      <TableCell>{getStatusBadge(verification.status)}</TableCell>
                      <TableCell>{verification.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedVerification(verification)}
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Product Verification</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Product ID:</label>
                                <p className="text-sm text-gray-600">{verification.productId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Company ID:</label>
                                <p className="text-sm text-gray-600">{verification.companyId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Comments (optional):</label>
                                <Textarea
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  placeholder="Add comments for the seller..."
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleProductVerification(verification.id, 'approved')}
                                  className="flex-1"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleProductVerification(verification.id, 'rejected')}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className="font-medium">{verification.companyId.slice(-8)}</TableCell>
                      <TableCell>{getStatusBadge(verification.status)}</TableCell>
                      <TableCell>{verification.documents.length} documents</TableCell>
                      <TableCell>{verification.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedVerification(verification)}
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>KYC Verification</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Company ID:</label>
                                <p className="text-sm text-gray-600">{verification.companyId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Documents:</label>
                                <div className="space-y-1">
                                  {verification.documents.map((doc, index) => (
                                    <p key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                      Document {index + 1}: {doc}
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Comments (optional):</label>
                                <Textarea
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  placeholder="Add comments for the company..."
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleKycVerification(verification.id, 'approved')}
                                  className="flex-1"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleKycVerification(verification.id, 'rejected')}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequests;
